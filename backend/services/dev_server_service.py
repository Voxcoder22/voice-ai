import os
import json
import webbrowser

from services.port_service import (
    is_port_in_use
)

# -----------------------------------
# SERVER STATE FILE
# -----------------------------------
SERVER_STATE_FILE = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "../../running_servers.json"
    )
)

# -----------------------------------
# LOAD SERVER STATE
# -----------------------------------
def load_server_state():

    if not os.path.exists(
        SERVER_STATE_FILE
    ):

        return {}

    try:

        with open(
            SERVER_STATE_FILE,
            "r",
            encoding="utf-8"
        ) as f:

            return json.load(f)

    except:

        return {}

# -----------------------------------
# SAVE SERVER STATE
# -----------------------------------
def save_server_state(data):

    with open(
        SERVER_STATE_FILE,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            data,
            f,
            indent=4
        )

# -----------------------------------
# CHECK IF SERVER RUNNING
# -----------------------------------
def is_server_running(project_name):

    servers = load_server_state()

    if project_name not in servers:

        return False

    server = servers[
        project_name
    ]

    # -----------------------------------
    # OLD BOOLEAN FORMAT SAFETY
    # -----------------------------------
    if isinstance(server, bool):

        return False

    port = server.get(
        "port"
    )

    # -----------------------------------
    # VALIDATE REAL PORT
    # -----------------------------------
    if not port:

        return False

    running = is_port_in_use(
        port
    )

    # -----------------------------------
    # AUTO CLEAN DEAD SERVERS
    # -----------------------------------
    if not running:

        servers[project_name][
            "running"
        ] = False

        save_server_state(
            servers
        )

        return False

    return True

# -----------------------------------
# MARK SERVER RUNNING
# -----------------------------------
def mark_server_running(
    project_name,
    port=5174,
    server_type="frontend"
):

    servers = load_server_state()

    servers[project_name] = {
        "running": True,
        "port": port,
        "type": server_type
    }

    save_server_state(
        servers
    )

    print(
        f"\nServer Running For:\n{project_name}\n"
    )

# -----------------------------------
# OPEN PROJECT IN BROWSER
# -----------------------------------
def open_project_in_browser(
    project_name
):

    servers = load_server_state()

    if project_name not in servers:

        return False

    server = servers[
        project_name
    ]

    # -----------------------------------
    # OLD BOOLEAN FORMAT SAFETY
    # -----------------------------------
    if isinstance(server, bool):

        return False

    # -----------------------------------
    # CHECK IF ACTIVE
    # -----------------------------------
    if not server.get(
        "running"
    ):

        return False

    # -----------------------------------
    # ONLY FRONTEND PROJECTS
    # -----------------------------------
    if server.get(
        "type"
    ) != "frontend":

        return False

    port = server.get(
        "port"
    )

    # -----------------------------------
    # VALIDATE LIVE PORT
    # -----------------------------------
    if not is_port_in_use(
        port
    ):

        servers[project_name][
            "running"
        ] = False

        save_server_state(
            servers
        )

        return False

    url = f"http://localhost:{port}"

    print(
        f"\nOpening Existing Project:\n{url}\n"
    )

    webbrowser.open(url)

    return True

# -----------------------------------
# STOP SERVER
# -----------------------------------
def stop_server(project_name):

    servers = load_server_state()

    if project_name in servers:

        # -----------------------------------
        # HANDLE OLD BOOLEAN FORMAT
        # -----------------------------------
        if isinstance(
            servers[project_name],
            bool
        ):

            servers[project_name] = {
                "running": False
            }

        else:

            servers[project_name][
                "running"
            ] = False

        save_server_state(
            servers
        )

        print(
            f"\nStopped Server:\n{project_name}\n"
        )