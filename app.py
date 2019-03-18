# from flask import Flask, render_template
# from flask_socketio import SocketIO, send, emit
# import time
# from threading import Lock
# import socket
# import numpy as np
# import eventlet

# #async_mode = None
# app = Flask(__name__)
# socketio = SocketIO(app)
# gen_thread = None
# rec_thread = None
# thread_lock = Lock()

# UDP_IP = "172.17.207.221"
# UDP_PORT = 6666
# address = (UDP_IP, UDP_PORT)
# time_step = 3
# print("initilization finished")

# # generate data
# def gen_data():
#     print("gen_data")
#     s = socket.socket(socket.AF_INET,  # Internet
#                          socket.SOCK_DGRAM)  # UDP
#     s.bind((UDP_IP, UDP_PORT))
#     s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
#     for t in range(1*3600//time_step):
#     #generate
#         value = np.random.random_sample((3,1)).tobytes()
#         print(value)
#         s.sendto(value, address)
#         #time.sleep(3)
        
# # receive data
# def receive_data():
#     print("receive_data")
#     print(True)
#     t = time.strftime("%H:%M:%S")
#     data, addr = s.recvfrom(1024)
#     d = np.frombuffer(data, dtype='float32').reshape((3,1))
#     print(d)
#     socketio.emit('update', {'data': [t,d]}, namespace='/test')

#     #@app.route("/data")
#     #def data():
#     #    return send_file('./data/data_stored.csv', mimetype='text/csv', cache_timeout=-1)


# @app.route('/')
# @app.route("/chart")
# def chart():
#     return render_template('simple_line_chart.html')
 
# @socketio.on('connect', namespace='/test')
# def test_connect():
#     print("test_connect")
#     emit('my response', {'data': 'Connected'})
    
#     global gen_thread
#     global rec_thread
#     gen_thread = socketio.start_background_task(target=gen_data)
#     #with thread_lock:
#     #    if gen_thread is None:
#     #        gen_thread = socketio.start_background_task(target=gen_data)
#     #    if rec_thread is None:
#     #        rec_thread = socketio.start_background_task(target=receive_data)

# # if __name__ == "__main__":
# #     socketio.run(app, debug=False)
# #     #app.run(threaded=True)
# # test_connect()
# socketio.run(app, debug=False)

from flask import Flask, render_template
from flask_socketio import SocketIO, emit
    
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('my event')
def test_message(message):
    emit('my response', {'data': 'got it!'})

if __name__ == '__main__':
    socketio.run(app)