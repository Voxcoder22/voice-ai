from services.executor_service import (
    create_react_vite_project,
    run_react_project
)

result = create_react_vite_project(
    "todo-app"
)

print(result)

if result["success"]:

    run_react_project(
        result["project_path"]
    )