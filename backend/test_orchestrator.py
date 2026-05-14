from services.orchestrator_service import (
    process_prompt
)

prompt = input(
    "Enter Prompt: "
)

result = process_prompt(
    prompt
)

print("\nFINAL RESULT:\n")
print(result)