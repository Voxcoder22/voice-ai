import os

# -----------------------------------
# GET PROJECT FILES
# -----------------------------------
def get_project_files(project_path):

    collected_files = []

    for root, dirs, files in os.walk(project_path):

        # -----------------------------------
        # IGNORE node_modules
        # -----------------------------------
        dirs[:] = [
            d for d in dirs
            if d != "node_modules"
        ]

        for file in files:

            full_path = os.path.join(
                root,
                file
            )

            relative_path = os.path.relpath(
                full_path,
                project_path
            )

            collected_files.append(
                relative_path
            )

    return collected_files

# -----------------------------------
# READ PROJECT FILES
# -----------------------------------
def read_project_context(project_path):

    context = ""

    files = get_project_files(
        project_path
    )

    for file_path in files:

        try:

            full_path = os.path.join(
                project_path,
                file_path
            )

            # -----------------------------------
            # SKIP LARGE FILES
            # -----------------------------------
            if os.path.getsize(full_path) > 50000:
                continue

            with open(
                full_path,
                "r",
                encoding="utf-8"
            ) as f:

                content = f.read()

            context += (
                f"\nFILE: {file_path}\n\n"
            )

            context += content

            context += "\n\n"

        except Exception as e:

            print(
                f"Failed reading {file_path}: {e}"
            )

    return context