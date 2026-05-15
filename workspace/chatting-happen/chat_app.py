import socket
import threading

class ChatClient:
    def __init__(self, host='127.0.0.1', port=55555):
        self.host = host
        self.port = port
        self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.username = input("Enter your username: ")

    def connect(self):
        try:
            self.client_socket.connect((self.host, self.port))
            print(f"Connected to server at {self.host}:{self.port}")
            self.client_socket.send(self.username.encode('utf-8'))
        except Exception as e:
            print(f"Connection error: {e}")
            return False
        return True

    def receive_messages(self):
        while True:
            try:
                message = self.client_socket.recv(1024).decode('utf-8')
                if message:
                    print(message)
            except:
                print("An error occurred!")
                self.client_socket.close()
                break

    def send_messages(self):
        while True:
            message = input()
            self.client_socket.send(f"{self.username}: {message}".encode('utf-8'))

    def start(self):
        if self.connect():
            receive_thread = threading.Thread(target=self.receive_messages)
            receive_thread.start()

            self.send_messages()

if __name__ == "__main__":
    client = ChatClient()
    client.start()