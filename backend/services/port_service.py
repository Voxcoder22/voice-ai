import socket

# -----------------------------------
# FIND FREE PORT
# -----------------------------------
def find_free_port(
    start_port=5174,
    end_port=5200
):

    for port in range(
        start_port,
        end_port
    ):

        if not is_port_in_use(port):

            return port

    return 5174

# -----------------------------------
# CHECK PORT IN USE
# -----------------------------------
def is_port_in_use(port):

    with socket.socket(
        socket.AF_INET,
        socket.SOCK_STREAM
    ) as sock:

        result = sock.connect_ex(
            ("localhost", port)
        )

        return result == 0