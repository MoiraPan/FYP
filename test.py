#encoding:utf-8
#!/usr/bin/env python
import psutil
import json
import time
import numpy as np
import socket
from threading import Lock
from flask import Flask, render_template
from flask_socketio import SocketIO

UDP_IP = "172.31.104.119"
UDP_PORT = 6666
addr = (UDP_IP, UDP_PORT)
time_step = 3
 
async_mode = None
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)
thread = None
thread_lock = Lock()
 
# generate and send data
def background_thread():
    # print("breakpoint1")
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  # UDP
    s.bind((UDP_IP, UDP_PORT))
    for t in range(24 * 3600 // time_step):
    #while True:
        #generate
        #time.sleep(time_step)
        value = np.random.random_sample((3,114))
        # print("breakpoint2")
        # print(value)
        s.sendto(json.dumps(value.tolist()).encode(), (UDP_IP, UDP_PORT))

    while True: 
        socketio.sleep(time_step)
        # print("breakpoint3")
        t = time.strftime("%H:%M:%S")
        data, addr = s.recvfrom(16384)
        arr = json.loads(data)
        # print(arr)
        # d = np.frombuffer(data, dtype='float64').reshape((3,2))
        # print("breakpoint4")
        socketio.emit('server_response',
                        {'data': arr, 'time': t},
                        namespace='/test')
 

@app.route('/')
def index():
    return render_template('test.html', async_mode=socketio.async_mode)
 
@socketio.on('connect', namespace='/test')
def test_connect():
    # print("breakpoint5")
    global thread
    with thread_lock:
        if thread is None:
            # print("breakpoint6")
            thread = socketio.start_background_task(target=background_thread)
 
if __name__ == '__main__':
    socketio.run(app, debug=True, use_reloader=False)