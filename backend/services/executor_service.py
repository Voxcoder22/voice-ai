import os
import subprocess
import webbrowser

from services.port_service import (
    find_free_port
)

from services.error_monitor_service import (
    extract_missing_package
)

# -----------------------------------
# BASE WORKSPACE
# -----------------------------------
BASE_WORKSPACE = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "../../workspace"
    )
)

# -----------------------------------
# ACTIVE REACT PROCESSES
# -----------------------------------
REACT_PROCESSES = {}

# -----------------------------------
# CREATE WORKSPACE IF NOT EXISTS
# -----------------------------------
os.makedirs(
    BASE_WORKSPACE,
    exist_ok=True
)

# -----------------------------------
# RUN TERMINAL COMMAND
# -----------------------------------
def run_command(command, cwd=None):

    print(f"\nRunning Command:\n{command}\n")

    process = subprocess.run(
        command,
        shell=True,
        cwd=cwd,
        text=True,
        capture_output=True,
        input="y\n"
    )

    print("STDOUT:\n")
    print(process.stdout)

    print("STDERR:\n")
    print(process.stderr)

    return {
        "success": process.returncode == 0,
        "stdout": process.stdout,
        "stderr": process.stderr
    }

# -----------------------------------
# INSTALL NPM PACKAGE
# -----------------------------------
def install_npm_package(
    project_path,
    package_name
):

    print(
        f"\nInstalling Package:\n{package_name}\n"
    )

    command = (
        f"npm install {package_name}"
    )

    result = run_command(
        command,
        cwd=project_path
    )

    return result

# -----------------------------------
# INSTALL MULTIPLE NPM PACKAGES
# -----------------------------------
def install_multiple_npm_packages(
    project_path,
    packages
):

    if not packages:

        return {
            "success": False,
            "message": "No packages provided"
        }

    # -----------------------------------
    # REMOVE DUPLICATES
    # -----------------------------------
    packages = list(
        set(packages)
    )

    package_string = " ".join(packages)

    print(
        f"\nInstalling Packages:\n{package_string}\n"
    )

    command = (
        f"npm install {package_string}"
    )

    result = run_command(
        command,
        cwd=project_path
    )

    return result

# -----------------------------------
# OPEN BROWSER
# -----------------------------------
def open_browser(url):

    print(
        f"\nOpening Browser:\n{url}\n"
    )

    webbrowser.open(url)

# -----------------------------------
# SETUP REACT PROJECT
# -----------------------------------
def setup_react_project(project_name):

    project_path = os.path.join(
        BASE_WORKSPACE,
        project_name
    )

    # -----------------------------------
    # CREATE VITE APP
    # -----------------------------------
    create_command = (
        f"npm create vite@latest "
        f"{project_name} "
        f"-- --template react --yes"
    )

    create_result = run_command(
        create_command,
        cwd=BASE_WORKSPACE
    )

    if not create_result["success"]:

        return {
            "success": False,
            "message": "Failed to create React project"
        }

    # -----------------------------------
    # INSTALL BASE PACKAGES
    # -----------------------------------
    install_result = run_command(
        "npm install",
        cwd=project_path
    )

    if not install_result["success"]:

        return {
            "success": False,
            "message": "npm install failed"
        }

    return {
        "success": True,
        "project_path": project_path
    }

# -----------------------------------
# RUN REACT PROJECT
# -----------------------------------
def run_react_project(
    project_name,
    project_path
):

    global REACT_PROCESSES

    print(
        "\nStarting React App...\n"
    )

    # -----------------------------------
    # FIND AVAILABLE PORT
    # -----------------------------------
    port = find_free_port()

    command = (
        f"npm run dev -- --port {port}"
    )

    # -----------------------------------
    # START VITE SERVER
    # -----------------------------------
    # process = subprocess.Popen(
    #     command,
    #     cwd=project_path,
    #     shell=True,
    #     stdout=subprocess.PIPE,
    #     stderr=subprocess.PIPE,
    #     text=True
    # )
    process = subprocess.Popen(

        [
            "cmd",
            "/k",
            command
        ],

        cwd=project_path,

        creationflags=subprocess.CREATE_NEW_CONSOLE
    )

    # -----------------------------------
    # STORE PROCESS
    # -----------------------------------
    REACT_PROCESSES[
        project_name
    ] = process

    # -----------------------------------
    # CHECK TERMINAL ERRORS
    # -----------------------------------
    try:

        stderr_output = process.stderr.read()

        if stderr_output:

            print(
                "\nVITE ERRORS DETECTED:\n"
            )

            print(stderr_output)

            # -----------------------------------
            # EXTRACT MISSING PACKAGE
            # -----------------------------------
            missing_package = (
                extract_missing_package(
                    stderr_output
                )
            )

            if missing_package:

                print(
                    f"\nAuto Installing Missing Package:\n{missing_package}\n"
                )

                install_npm_package(
                    project_path,
                    missing_package
                )

                print(
                    "\nRestarting React App After Fix...\n"
                )

                restart_react_project(
                    project_name,
                    project_path,
                    port
                )

    except Exception as e:

        print(
            f"\nError Monitor Failed:\n{e}\n"
        )

    # -----------------------------------
    # OPEN BROWSER
    # -----------------------------------
    open_browser(
        f"http://localhost:{port}"
    )

    return port

# -----------------------------------
# RESTART REACT PROJECT
# -----------------------------------
def restart_react_project(
    project_name,
    project_path,
    port=5174
):

    global REACT_PROCESSES

    # -----------------------------------
    # STOP OLD PROCESS
    # -----------------------------------
    if project_name in REACT_PROCESSES:

        old_process = REACT_PROCESSES[
            project_name
        ]

        try:

            old_process.kill()

            print(
                f"\nStopped Old React Server:\n{project_name}\n"
            )

        except:

            pass

    command = (
        f"npm run dev -- --port {port}"
    )

    print(
        f"\nRestarting React App:\n{project_name}\n"
    )

    # -----------------------------------
    # START NEW SERVER
    # -----------------------------------
    process = subprocess.Popen(
        command,
        cwd=project_path,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    # -----------------------------------
    # STORE NEW PROCESS
    # -----------------------------------
    REACT_PROCESSES[
        project_name
    ] = process

    # -----------------------------------
    # OPEN UPDATED APP
    # -----------------------------------
    open_browser(
        f"http://localhost:{port}"
    )

    return port

# -----------------------------------
# SETUP PYTHON PROJECT
# -----------------------------------
def setup_python_project(project_name):

    project_path = os.path.join(
        BASE_WORKSPACE,
        project_name
    )

    os.makedirs(
        project_path,
        exist_ok=True
    )

    return {
        "success": True,
        "project_path": project_path
    }

# -----------------------------------
# RUN PYTHON PROJECT
# -----------------------------------
def run_python_project(project_path):

    print(
        "\nStarting Python App...\n"
    )

    # -----------------------------------
    # INSTALL REQUIREMENTS
    # -----------------------------------
    requirements_path = os.path.join(
        project_path,
        "requirements.txt"
    )

    if os.path.exists(requirements_path):

        print(
            "\nInstalling Python Requirements...\n"
        )

        subprocess.run(

            "pip install -r requirements.txt",

            cwd=project_path,

            shell=True
        )

    # -----------------------------------
    # FIND PYTHON FILES
    # -----------------------------------
    py_files = []

    for file in os.listdir(project_path):

        if file.endswith(".py"):

            py_files.append(file)

    if not py_files:

        print(
            "\nNo Python Files Found\n"
        )

        return

    # -----------------------------------
    # FASTAPI DETECTION
    # -----------------------------------
    if "main.py" in py_files:

        main_path = os.path.join(
            project_path,
            "main.py"
        )

        with open(
            main_path,
            "r",
            encoding="utf-8"
        ) as file:

            content = file.read()

        if "FastAPI" in content:

            command = (
                "python -m uvicorn main:app --reload"
            )

        else:

            command = (
                "python main.py"
            )

    # -----------------------------------
    # FLASK DETECTION
    # -----------------------------------
    elif "app.py" in py_files:

        app_path = os.path.join(
            project_path,
            "app.py"
        )

        with open(
            app_path,
            "r",
            encoding="utf-8"
        ) as file:

            content = file.read()

        if "Flask" in content:

            command = (
                "python app.py"
            )

        else:

            command = (
                "python app.py"
            )

    # -----------------------------------
    # NORMAL PYTHON SCRIPT
    # -----------------------------------
    else:

        entry_file = py_files[0]

        command = (
            f"python {entry_file}"
        )

    print(
        f"\nRunning Python Command:\n{command}\n"
    )

    subprocess.Popen(

        [
            "cmd",
            "/k",
            command
        ],

        cwd=project_path,

        creationflags=subprocess.CREATE_NEW_CONSOLE
    )

# -----------------------------------
# SETUP JAVA PROJECT
# -----------------------------------
def setup_java_project(project_name):

    project_path = os.path.join(
        BASE_WORKSPACE,
        project_name
    )

    os.makedirs(
        project_path,
        exist_ok=True
    )

    return {
        "success": True,
        "project_path": project_path
    }

# -----------------------------------
# RUN JAVA PROJECT
# -----------------------------------
def run_java_project(project_path):

    print(
        "\nStarting Java Project...\n"
    )

    # -----------------------------------
    # SPRING BOOT PROJECT
    # -----------------------------------
    pom_path = os.path.join(
        project_path,
        "pom.xml"
    )

    if os.path.exists(pom_path):

        command = (
            "mvn spring-boot:run"
        )

    else:

        # -----------------------------------
        # SIMPLE JAVA PROJECT
        # -----------------------------------
        java_files = []

        for file in os.listdir(project_path):

            if file.endswith(".java"):

                java_files.append(file)

        if not java_files:

            print(
                "\nNo Java Files Found\n"
            )

            return

        main_file = java_files[0]

        class_name = (
            main_file
            .replace(".java", "")
        )

        command = (
            f"javac {main_file} && java {class_name}"
        )

    print(
        f"\nRunning Java Command:\n{command}\n"
    )

    subprocess.Popen(

        [
            "cmd",
            "/k",
            command
        ],

        cwd=project_path,

        creationflags=subprocess.CREATE_NEW_CONSOLE
    )