from backend.graph.workflow import graph


def main():
    sample_code = """
password = "admin123"

username = input("Enter username: ")

query = f"SELECT * FROM users WHERE username = '{username}'"

print(query)
"""

    initial_state = {
        "original_code": sample_code,
        "audit_report": "",
        "refactored_code": "",
        "documentation": "",
    }

    print("Starting workflow...")

    result = graph.invoke(initial_state)

    print("Workflow completed.")

    print("\n" + "=" * 60)
    print("AUDIT REPORT")
    print("=" * 60)
    print(result["audit_report"])

    print("\n" + "=" * 60)
    print("REFACTORED CODE")
    print("=" * 60)
    print(result["refactored_code"])

    print("\n" + "=" * 60)
    print("DOCUMENTATION")
    print("=" * 60)
    print(result["documentation"])


if __name__ == "__main__":
    main()