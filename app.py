from flask import Flask, render_template, send_file
from flask_socketio import SocketIO
import time
from threading import Lock
import multiprocessing
import socket
import numpy as np

async_mode = None
app = Flask(__name__)
socketio = SocketIO(app, async_mode=async_mode)
gen_thread = None
rec_thread = None
thread_lock = Lock()

UDP_IP = "172.17.207.221"
UDP_PORT = 6666
time_step = 3


# generate data
def gen_data():
    sock = socket.socket(socket.AF_INET,  # Internet
                         socket.SOCK_DGRAM)  # UDP
    sock.bind((UDP_IP, UDP_PORT))
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    for t in range(0,1):
    #generate
        value = np.random.random_sample((3,1)).tobytes()
        print(value)
        s.sendto(value, address)
        #time.sleep(3)
    while True:
        t = time.strftime("%H:%M:%S")
        data, addr = s.recvfrom(1024)
        print(data)
        d = np.frombuffer(data, dtype='float32').reshape((3,1))
        print(d)
        
# receive data
def receive_data():
    print(True)
    t = time.strftime("%H:%M:%S")
    data, addr = s.recvfrom(1024)
    d = np.frombuffer(data, dtype='float32').reshape((3,1))
    print(d)
    socketio.emit('update', {'data': [t,d]}, namespace='/data')

    #@app.route("/data")
    #def data():
    #    return send_file('./data/data_stored.csv', mimetype='text/csv', cache_timeout=-1)

@app.route('/')
@app.route("/chart")
def index():
    return render_template('simple_line_chart.html', async_mode=socketio.async_mode)
 
@socketio.on('connect', namespace='/data')
def test_connect():
    global gen_thread
    global rec_thread
    with thread_lock:
        if gen_thread is None:
            gen_thread = socketio.start_background_task(target=gen_data)
        if rec_thread is None:
            rec_thread = socketio.start_background_task(target=receive_data)

if __name__ == '__main__':
    socketio.run(app, debug=False)
