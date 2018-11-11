# UDP Server will receive data from udp client

import socket

PORT = 8000
server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
address = ("", PORT)
server_socket.bind(address)

while True:
    receive_data, client_address = server_socket.recvfrom(1024)
    print("Receive message! Client IP: %s Data: %s" % (client_address, receive_data.decode()))
