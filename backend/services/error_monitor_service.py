import re

# -----------------------------------
# EXTRACT MISSING PACKAGE
# -----------------------------------
def extract_missing_package(error_output):

    patterns = [

        r'Failed to resolve import \"([^\"]+)\"',

        r"Cannot find module '([^']+)'",

        r'Cannot resolve \"([^\"]+)\"'
    ]

    for pattern in patterns:

        matches = re.findall(
            pattern,
            error_output
        )

        if matches:

            package_name = matches[0]

            # -----------------------------------
            # REMOVE LOCAL IMPORTS
            # -----------------------------------
            if package_name.startswith("."):

                continue

            if package_name.startswith("/"):

                continue

            # -----------------------------------
            # HANDLE SUBPATHS
            # -----------------------------------
            if "/" in package_name:

                split_pkg = package_name.split("/")

                # Scoped package
                if package_name.startswith("@"):

                    if len(split_pkg) >= 2:

                        package_name = (
                            split_pkg[0]
                            + "/"
                            + split_pkg[1]
                        )

                else:

                    package_name = split_pkg[0]

            return package_name

    return None