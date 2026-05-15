import os
import re

from services.executor_service import (
    setup_react_project,
    run_react_project,
    setup_python_project,
    run_python_project,
    setup_java_project,
    run_java_project,
    install_npm_package,
    restart_react_project,
    install_multiple_npm_packages,
    BASE_WORKSPACE
)

from services.file_service import (
    parse_ai_response,
    write_files
)

from services.context_service import (
    read_project_context
)

from services.session_service import (
    set_active_project,
    get_active_project
)

from services.dev_server_service import (
    is_server_running,
    mark_server_running,
    open_project_in_browser
)

from services.workspace_service import (
    find_matching_project
)

from services.mistral_service import (
    generate_ai_response
)

# -----------------------------------
# DETECT PROJECT TYPE
# -----------------------------------
def detect_project_type(prompt):

    prompt = prompt.lower()

    if "react" in prompt:
        return "react"

    if "vite" in prompt:
        return "react"

    if "frontend" in prompt:
        return "react"

    if "flask" in prompt:
        return "python"

    if "python" in prompt:
        return "python"

    if "java" in prompt:
        return "java"

    return None

# -----------------------------------
# NORMAL CHAT DETECTION
# -----------------------------------
# -----------------------------------
# NORMAL CHAT DETECTION
# -----------------------------------
def is_normal_chat(prompt):

    prompt = prompt.lower()

    coding_keywords = [

        "create",
        "build",
        "generate",
        "make",
        "react",
        "python",
        "java",
        "fix",
        "install",
        "project",
        "component",
        "frontend",
        "backend",
        "api",
        "code",
        "app",
        "website",
        "html",
        "css",
        "javascript",
        "flask",
        "node",
        "express",
        "mongodb",
        "sql"
    ]

    # -----------------------------------
    # IF ANY CODING WORD EXISTS
    # -----------------------------------
    for word in coding_keywords:

        if word in prompt:

            return False

    # -----------------------------------
    # SHORT CONVERSATION DETECTION
    # -----------------------------------
    normal_chat_phrases = [

        "how are you",
        "how you doing",
        "what's up",
        "who are you",
        "tell me",
        "hello",
        "hi",
        "hey",
        "good morning",
        "good evening",
        "thank you",
        "thanks"
    ]

    for phrase in normal_chat_phrases:

        if phrase in prompt:

            return True

    # -----------------------------------
    # DEFAULT SHORT TEXT CHAT
    # -----------------------------------
    if len(prompt.split()) <= 6:

        return True

    return False

# -----------------------------------
# DETECT NEW PROJECT REQUEST
# -----------------------------------
def is_new_project_request(prompt):

    prompt = prompt.lower()

    trigger_words = [
        "create",
        "generate",
        "build",
        "make"
    ]

    for word in trigger_words:

        if word in prompt:
            return True

    return False

# -----------------------------------
# SWITCH PROJECT REQUEST
# -----------------------------------
def is_switch_project_request(prompt):

    prompt = prompt.lower()

    trigger_words = [
        "switch to",
        "work on",
        "open",
        "go to"
    ]

    for word in trigger_words:

        if word in prompt:
            return True

    return False

# -----------------------------------
# DEPENDENCY FIX REQUEST
# -----------------------------------
def is_dependency_fix_request(prompt):

    prompt = prompt.lower()

    trigger_words = [
        "install",
        "dependency",
        "dependencies",
        "package",
        "packages",
        "fix issue",
        "solve issue",
        "solve dependency"
    ]

    for word in trigger_words:

        if word in prompt:
            return True

    return False

# -----------------------------------
# EXTRACT PACKAGE NAME
# -----------------------------------
def extract_package_name(
    prompt,
    project_name=None
):

    prompt = prompt.lower()

    words = prompt.split()

    ignored_words = [
        "go",
        "to",
        "and",
        "install",
        "in",
        "the",
        "project",
        "dependency",
        "dependencies",
        "package",
        "packages",
        "fix",
        "solve",
        "issue"
    ]

    normalized_project = None

    if project_name:

        normalized_project = (
            project_name
            .lower()
            .replace("-", "")
            .replace("_", "")
        )

    for word in words:

        clean_word = (
            word
            .replace("-", "")
            .replace("_", "")
        )

        if word in ignored_words:
            continue

        if normalized_project:

            if clean_word == normalized_project:
                continue

        if "-" in word:

            return word

    return None

# -----------------------------------
# GENERATE PROJECT NAME
# -----------------------------------
def generate_project_name(prompt):

    prompt = prompt.lower()

    remove_words = [
        "create",
        "generate",
        "build",
        "make",
        "me",
        "a",
        "an",
        "in",
        "with",
        "using",
        "react",
        "python",
        "java",
        "flask",
        "vite",
        "app",
        "application"
    ]

    words = re.findall(
        r'\w+',
        prompt
    )

    filtered_words = []

    for word in words:

        if word not in remove_words:

            filtered_words.append(
                word
            )

    project_name = "-".join(
        filtered_words[:2]
    )

    if not project_name:

        project_name = "my-project"

    return project_name

# -----------------------------------
# FILTER FILES
# -----------------------------------
def filter_files(files):

    BLOCKED_FILES = [
        "package.json",
        "package-lock.json",
        "vite.config.js",
        "vite.config.ts",
        "index.html"
    ]

    safe_files = []

    for file in files:

        filename = file["filename"]

        if filename in BLOCKED_FILES:

            print(
                f"\nBlocked File:\n{filename}\n"
            )

            continue

        safe_files.append(file)

    return safe_files

# -----------------------------------
# GET OR CREATE PROJECT
# -----------------------------------
def get_or_create_project(
    project_name,
    project_type
):

    project_path = os.path.join(
        BASE_WORKSPACE,
        project_name
    )

    if os.path.exists(project_path):

        print(
            f"\nUsing Existing Project:\n{project_path}\n"
        )

        return {
            "success": True,
            "project_path": project_path,
            "existing": True
        }

    if project_type == "react":

        result = setup_react_project(
            project_name
        )

        result["existing"] = False

        return result

    if project_type == "python":

        result = setup_python_project(
            project_name
        )

        result["existing"] = False

        return result

    if project_type == "java":

        result = setup_java_project(
            project_name
        )

        result["existing"] = False

        return result

# -----------------------------------
# MAIN ORCHESTRATOR
# -----------------------------------
def process_prompt(prompt):

    # -----------------------------------
    # NORMAL CHAT FLOW
    # -----------------------------------
    if is_normal_chat(prompt):

        print(
            "\nNormal Conversation Detected\n"
        )

        ai_response = generate_ai_response(
            prompt
        )

        return {

            "success": True,

            "message": ai_response,

            "chat_mode": True
        }

    # -----------------------------------
    # CHECK REQUEST TYPES
    # -----------------------------------
    new_project = is_new_project_request(
        prompt
    )

    switch_project = is_switch_project_request(
        prompt
    )

    dependency_fix = is_dependency_fix_request(
        prompt
    )

    # ===================================
    # DEPENDENCY FIX FLOW
    # ===================================
    if dependency_fix:

        matched_project = find_matching_project(
            prompt
        )

        if not matched_project:

            return {
                "success": False,
                "message": "Project not found"
            }

        print(
            f"\nTarget Project:\n{matched_project}\n"
        )

        package_name = extract_package_name(
            prompt,
            matched_project
        )

        if not package_name:

            return {
                "success": False,
                "message": "Could not detect package name"
            }

        print(
            f"\nInstalling Dependency:\n{package_name}\n"
        )

        project_path = os.path.join(
            BASE_WORKSPACE,
            matched_project
        )

        result = install_npm_package(
            project_path,
            package_name
        )

        return {
            "success": result["success"],
            "message": f"Installed {package_name} in {matched_project}"
        }

    # ===================================
    # SWITCH PROJECT FLOW
    # ===================================
    if switch_project:

        matched_project = find_matching_project(
            prompt
        )

        if not matched_project:

            return {
                "success": False,
                "message": "Project not found"
            }

        # -----------------------------------
        # LOAD ACTIVE SESSION
        # -----------------------------------
        session = get_active_project()

        # -----------------------------------
        # USE SAVED PROJECT TYPE
        # -----------------------------------
        project_type = session.get(
            "project_type",
            "react"
        )

        # -----------------------------------
        # SET ACTIVE PROJECT
        # -----------------------------------
        set_active_project(
            matched_project,
            project_type
        )

        print(
            f"\nSwitched To Project:\n{matched_project}\n"
        )

        # -----------------------------------
        # OPEN PROJECT
        # -----------------------------------
        opened = open_project_in_browser(
            matched_project
        )

        if opened:

            print(
                "\nOpened Existing Frontend Project\n"
            )

        # -----------------------------------
        # SIMPLE SWITCH REQUESTS
        # -----------------------------------
        clean_prompt = prompt.lower().strip()

        simple_requests = [

            f"work on {matched_project.lower()}",
            f"switch to {matched_project.lower()}",
            f"open {matched_project.lower()}",
            f"go to {matched_project.lower()}"
        ]

        # -----------------------------------
        # ONLY SWITCH PROJECT
        # -----------------------------------
        if clean_prompt in simple_requests:

            return {
                "success": True,
                "message": f"Switched to {matched_project}"
            }

        # -----------------------------------
        # CONTINUE UPDATE FLOW
        # -----------------------------------
        project_name = matched_project

        print(
            f"\nContinuing AI Update Flow For:\n{project_name}\n"
        )

        switch_project = False

        # -----------------------------------
        # PREVENT NEW PROJECT CREATION
        # -----------------------------------
        new_project = False

    # ===================================
    # NEW PROJECT FLOW
    # ===================================
    if new_project:

        project_type = detect_project_type(
            prompt
        )

        if not project_type:

            project_type = "react"

        print(
            f"\nDetected Project Type: {project_type}\n"
        )

        project_name = generate_project_name(
            prompt
        )

        print(
            f"\nProject Name: {project_name}\n"
        )

        set_active_project(
            project_name,
            project_type
        )

    # ===================================
    # EXISTING PROJECT FLOW
    # ===================================
    elif not switch_project:

        session = get_active_project()

        project_name = session.get(
            "project_name"
        )

        project_type = session.get(
            "project_type"
        )

        if not project_name:

            return {
                "success": False,
                "message": "No active project found"
            }

        print(
            f"\nContinuing Active Project:\n{project_name}\n"
        )

    # -----------------------------------
    # GET OR CREATE PROJECT
    # -----------------------------------
    setup_result = get_or_create_project(
        project_name,
        project_type
    )

    if not setup_result["success"]:

        return setup_result

    project_path = setup_result[
        "project_path"
    ]

    # -----------------------------------
    # READ PROJECT CONTEXT
    # -----------------------------------
    print(
        "\nReading Existing Project Context...\n"
    )

    project_context = read_project_context(
        project_path
    )

    # -----------------------------------
    # BUILD ENHANCED PROMPT
    # -----------------------------------
    if project_type == "react":

        enhanced_prompt = f"""
You are modifying an EXISTING Vite React application.

IMPORTANT:
- Use App.jsx instead of App.js
- Use main.jsx instead of index.js
- Do NOT generate package.json
- Do NOT generate vite.config.js
- Only generate files inside src/
- Modify existing code intelligently
- Preserve existing functionality unless asked otherwise

CURRENT PROJECT FILES:
{project_context}

USER REQUEST:
{prompt}
"""

    else:

        enhanced_prompt = f"""
You are modifying an EXISTING {project_type} project.

CURRENT PROJECT FILES:
{project_context}

USER REQUEST:
{prompt}
"""

    # -----------------------------------
    # GENERATE AI RESPONSE
    # -----------------------------------
    print(
        "\nGenerating AI response...\n"
    )

    ai_response = generate_ai_response(
        enhanced_prompt
    )

    # -----------------------------------
    # DEBUG AI RESPONSE
    # -----------------------------------
    print(
        "\n================ AI RESPONSE ================\n"
    )

    print(ai_response)

    print(
        "\n=============================================\n"
    )

    # -----------------------------------
    # PARSE FILES
    # -----------------------------------
    files = parse_ai_response(
        ai_response
    )

    print(
        "\nPARSED FILES:\n"
    )

    print(files)

    # -----------------------------------
    # FILTER REACT FILES
    # -----------------------------------
    if project_type == "react":

        files = filter_files(
            files
        )

    # -----------------------------------
    # WRITE FILES
    # -----------------------------------
    write_files(
        project_path,
        files
    )

    # -----------------------------------
    # AUTO INSTALL MISSING DEPENDENCIES
    # -----------------------------------
    if project_type == "react":

        missing_packages = []

        for file in files:

            content = file["content"]

            if "lucide-react" in content:

                missing_packages.append(
                    "lucide-react"
                )

            if "axios" in content:

                missing_packages.append(
                    "axios"
                )

            if "framer-motion" in content:

                missing_packages.append(
                    "framer-motion"
                )

        missing_packages = list(
            set(missing_packages)
        )

        if missing_packages:

            install_multiple_npm_packages(
                project_path,
                missing_packages
            )

            restart_react_project(
                project_name,
                project_path
            )

    # -----------------------------------
    # RUN REACT PROJECT
    # -----------------------------------
    if project_type == "react":

        if not is_server_running(
            project_name
        ):

            port = run_react_project(
                project_name,
                project_path
            )

            mark_server_running(
                project_name,
                port=port,
                server_type="frontend"
            )

        else:

            print(
                "\nReact Server Already Running\n"
            )

    # -----------------------------------
    # RUN PYTHON PROJECT
    # -----------------------------------
    elif project_type == "python":

        run_python_project(
            project_path
        )

    # -----------------------------------
    # RUN JAVA PROJECT
    # -----------------------------------
    elif project_type == "java":

        run_java_project(
            project_path
        )

    return {

        "success": True,

        "message":
            f"{project_type} project updated successfully",

        "files": files
    }