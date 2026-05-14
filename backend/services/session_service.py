import os
import json

# -----------------------------------
# SESSION FILE
# -----------------------------------
SESSION_FILE = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "../../session.json"
    )
)

# -----------------------------------
# SET ACTIVE PROJECT
# -----------------------------------
def set_active_project(
    project_name,
    project_type
):

    session_data = {
        "project_name": project_name,
        "project_type": project_type
    }

    with open(
        SESSION_FILE,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            session_data,
            f,
            indent=4
        )

    print(
        f"\nActive Project Set:\n{project_name}\n"
    )

# -----------------------------------
# GET ACTIVE PROJECT
# -----------------------------------
def get_active_project():

    if not os.path.exists(
        SESSION_FILE
    ):

        return {
            "project_name": None,
            "project_type": None
        }

    with open(
        SESSION_FILE,
        "r",
        encoding="utf-8"
    ) as f:

        session_data = json.load(f)

    return session_data