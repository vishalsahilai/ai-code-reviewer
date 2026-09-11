from fastapi import UploadFile


ALLOWED_EXTENSIONS = {".py"}
MAX_FILE_SIZE = 1_000_000  # 1 MB


async def read_python_file(file: UploadFile) -> str:
    """
    Validate and read an uploaded Python file.

    Args:
        file: Uploaded file received from FastAPI.

    Returns:
        Python source code as a string.

    Raises:
        ValueError: If the file is invalid.
    """

    if not file.filename:
        raise ValueError("Uploaded file must have a filename.")

    filename = file.filename.lower()

    if not any(filename.endswith(extension) for extension in ALLOWED_EXTENSIONS):
        raise ValueError("Only .py files are allowed.")

    content = await file.read()

    if not content:
        raise ValueError("Uploaded file is empty.")

    if len(content) > MAX_FILE_SIZE:
        raise ValueError("Uploaded file is too large. Maximum size is 1 MB.")

    try:
        code = content.decode("utf-8")
    except UnicodeDecodeError as exc:
        raise ValueError("Python file must use UTF-8 encoding.") from exc

    if not code.strip():
        raise ValueError("Uploaded Python file contains no code.")

    return code