#encoding:utf-8
#!/usr/bin/env python
import psutil
import json
import time
import numpy as np
import socket
import scipy.io
from threading import Lock
from flask import Flask, render_template
from flask_socketio import SocketIO

UDP_IP = "192.168.1.106"
UDP_PORT = 6666
time_step = 1
starttime = time.time()
 
async_mode = None
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)
thread = None
thread_lock = Lock()

subcarrier = 0
# generate and send data
def background_thread():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  # UDP
    s.bind((UDP_IP, UDP_PORT))

    mat = scipy.io.loadmat('1.mat')
    matamp = np.transpose(mat['CSIamp'])
    matamp = matamp.reshape(300,3,114)
    # udp send, send one file data every time
    for msg in matamp:
        s.sendto(json.dumps(msg.tolist()).encode(), (UDP_IP, UDP_PORT))
        # print (msg)
    # for t in range(24 * 3600 // time_step):
    # # while True:
    #     #generate
    #     # time.sleep(time_step - ((time.time() - starttime) % time_step))
    #     value = np.random.random_sample((3,114))
    #     s.sendto(json.dumps(value.tolist()).encode(), (UDP_IP, UDP_PORT))

    while True: 
        socketio.sleep(time_step)
        t = time.strftime("%H:%M:%S")
        data, addr = s.recvfrom(16384)
        arr = json.loads(data)
        
        # for i in range (3):
        #     array.append([])
        #     for j in range (5):
        #         data, addr = s.recvfrom(16384)
        #         arr = json.loads(data)
        #         # print(arr)
        #         array[i].append(arr)

        socketio.emit('server_response',
                        {'data': arr, 'time': t},
                        namespace='/test')
 
@app.route('/')
def index():
    return render_template('test.html', async_mode=socketio.async_mode)
 
@socketio.on('connect', namespace='/test')
def test_connect():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=background_thread)
 
if __name__ == '__main__':
    socketio.run(app, debug=True, use_reloader=False)