import scipy.io
import numpy as np
import socket
import json

subcarrier = 0
address = ('127.0.0.1', 31500)
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

mat = scipy.io.loadmat('4.mat')
matamp = np.transpose(mat['CSIamp'])

# udp send, send one file data every time
for msg in mat['CSIamp'][subcarrier]:
    s.sendto(json.dumps(msg).encode(), address)
    print (1)

s.close()