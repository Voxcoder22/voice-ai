import os
import re

from services.executor_service import (
    BASE_WORKSPACE
)

# -----------------------------------
# NORMALIZE TEXT
# -----------------------------------
def normalize_text(text):

    text = text.lower()

    # -----------------------------------
    # REPLACE SPECIAL CHARS
    # -----------------------------------
    text = text.replace("-", " ")
    text = text.replace("_", " ")

    # -----------------------------------
    # REMOVE EXTRA SPACES
    # -----------------------------------
    text = re.sub(
        r"\s+",
        " ",
        text
    ).strip()

    return text

# -----------------------------------
# GET ALL PROJECTS
# -----------------------------------
def get_all_projects():

    if not os.path.exists(
        BASE_WORKSPACE
    ):

        return []

    projects = []

    for item in os.listdir(
        BASE_WORKSPACE
    ):

        full_path = os.path.join(
            BASE_WORKSPACE,
            item
        )

        if os.path.isdir(full_path):

            projects.append(item)

    return projects

# -----------------------------------
# FIND MATCHING PROJECT
# -----------------------------------
def find_matching_project(prompt):

    normalized_prompt = normalize_text(
        prompt
    )

    projects = get_all_projects()

    for project in projects:

        normalized_project = normalize_text(
            project
        )

        # -----------------------------------
        # MATCH PROJECT NAME
        # -----------------------------------
        if normalized_project in normalized_prompt:

            return project

    return None