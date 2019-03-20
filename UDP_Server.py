# import psutil
# import json
# import time
# import numpy as np
# import socket
# from threading import Lock
# from flask import Flask, render_template
# from flask_socketio import SocketIO

# UDP_IP = "192.168.1.106"
# UDP_PORT = 6666
# addr = (UDP_IP, UDP_PORT)
# time_step = 3.0

# s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  # UDP
# s.bind((UDP_IP, UDP_PORT))
def run_server():
    starttime = time.time()
    while True:
        #generate
        time.sleep(time_step - ((time.time() - starttime) % time_step))
        value = np.random.random_sample((3,114))
        # print("breakpoint2")
        # print(value)
        s.sendto(json.dumps(value.tolist()).encode(), (UDP_IP, UDP_PORT))