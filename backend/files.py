import os

ROOT = os.path.expanduser("~")


def search_files(keyword: str):
    results = []

    keyword = keyword.lower()

    for root, dirs, files in os.walk(ROOT):

        # Skip common system folders
        dirs[:] = [
            d for d in dirs
            if d not in {
                "AppData",
                ".git",
                "node_modules",
                "__pycache__",
                ".venv",
                "venv"
            }
        ]

        for file in files:
            if keyword in file.lower():
                results.append({
                    "name": file,
                    "path": os.path.join(root, file)
                })

                # Limit results
                if len(results) >= 100:
                    return results

    return results