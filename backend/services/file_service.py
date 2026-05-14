import os

# -----------------------------------
# PARSE AI RESPONSE
# -----------------------------------
def parse_ai_response(ai_response):

    files = []

    # -----------------------------------
    # SPLIT BY FILE:
    # -----------------------------------
    sections = ai_response.split("FILE:")

    for section in sections:

        section = section.strip()

        if not section:
            continue

        try:

            # -----------------------------------
            # GET FILENAME
            # -----------------------------------
            first_line_end = section.find("\n")

            filename = section[
                :first_line_end
            ].strip()

            # -----------------------------------
            # FIND CODE BLOCK
            # -----------------------------------
            start_token = "<CODE_BLOCK_START>"
            end_token = "<CODE_BLOCK_END>"

            start_index = section.find(start_token)
            end_index = section.find(end_token)

            if (
                start_index == -1 or
                end_index == -1
            ):
                continue

            code_content = section[
                start_index + len(start_token):
                end_index
            ].strip()

            # -----------------------------------
            # REMOVE LANGUAGE LINE
            # -----------------------------------
            code_lines = code_content.split("\n")

            if len(code_lines) > 1:
                code_content = "\n".join(
                    code_lines[1:]
                )

            files.append({
                "filename": filename,
                "content": code_content
            })

        except Exception as e:

            print(
                f"Error parsing section: {e}"
            )

    return files

# -----------------------------------
# WRITE FILES
# -----------------------------------
def write_files(project_path, files):

    for file in files:

        full_path = os.path.join(
            project_path,
            file["filename"]
        )

        # -----------------------------------
        # CREATE DIRECTORIES
        # -----------------------------------
        os.makedirs(
            os.path.dirname(full_path),
            exist_ok=True
        )

        # -----------------------------------
        # WRITE FILE
        # -----------------------------------
        with open(
            full_path,
            "w",
            encoding="utf-8"
        ) as f:

            f.write(file["content"])

        print(f"\nCreated File:\n{full_path}")