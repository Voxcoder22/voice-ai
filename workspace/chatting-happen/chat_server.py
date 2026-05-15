import socket
import threading

class ChatServer:
    def __init__(self, host='127.0.0.1', port=55555):
        self.host = host
        self.port = port
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.clients = []
        self.usernames = []

    def start(self):
        self.server_socket.bind((self.host, self.port))
        self.server_socket.listen()
        print(f"Server started on {self.host}:{self.port}")

        while True:
            client_socket, client_address = self.server_socket.accept()
            print(f"Connection from {client_address}")

            username = client_socket.recv(1024).decode('utf-8')
            self.usernames.append(username)
            self.clients.append(client_socket)

            print(f"{username} joined the chat!")
            self.broadcast(f"{username} joined the chat!".encode('utf-8'))

            thread = threading.Thread(target=self.handle_client, args=(client_socket,))
            thread.start()

    def broadcast(self, message):
        for client in self.clients:
            try:
                client.send(message)
            except:
                self.remove_client(client)

    def handle_client(self, client_socket):
        while True:
            try:
                message = client_socket.recv(1024)
                self.broadcast(message)
            except:
                index = self.clients.index(client_socket)
                username = self.usernames[index]
                self.remove_client(client_socket)
                self.broadcast(f"{username} left the chat!".encode('utf-8'))
                break

    def remove_client(self, client_socket):
        index = self.clients.index(client_socket)
        self.clients.remove(client_socket)
        client_socket.close()
        username = self.usernames[index]
        self.usernames.remove(username)

if __name__ == "__main__":
    server = ChatServer()
    server.start()