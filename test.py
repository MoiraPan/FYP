#encoding:utf-8
#!/usr/bin/env python
import psutil
import time
from threading import Lock
from flask import Flask, render_template
from flask_socketio import SocketIO
 
async_mode = None
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)
thread = None
thread_lock = Lock()

UDP_IP = "172.17.207.221"
UDP_PORT = 6666
addr = (UDP_IP, UDP_PORT)
time_step = 3
 
# 后台线程 产生数据，即刻推送至前端
def background_thread():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  # UDP
    s.bind((UDP_IP, UDP_PORT))
    stringarray = []
    for t in range(24*3600//time_step):
        #generate
        value = np.random.random_sample((3,2))
        #print(value)
        s.sendto(value, addr)

    while True: 
        t = time.strftime("%H:%M:%S")
        data, addr = s.recvfrom(1024)
        #print(data)
        d = np.frombuffer(data, dtype='float').reshape((3,2))
        #print(d)
        socketio.emit('server_response',
                        {'data': [t, d], 'count': count},
                        namespace='/test')
 
 
@app.route('/')
def index():
    return render_template('simple_line_chart.html', async_mode=socketio.async_mode)
 
@socketio.on('connect', namespace='/test')
def test_connect():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=background_thread)
 
if __name__ == '__main__':
    socketio.run(app, debug=True)