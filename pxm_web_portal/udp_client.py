# UDP Client will try to send data to server

import socket
import random

SERVER_IP = "192.168.79.127"    # Change Server IP here!

client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
while True:
    # Keep sending message to server
    msg = str(random.randint(1,100))    # Randomly generate number from 1 to 100, change range here
    server_address = (SERVER_IP, 8000)
    client_socket.sendto(msg.encode(), server_address)