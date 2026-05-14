def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

def power(a, b):
    return a ** b

def main():
    print("Simple Calculator")
    print("Operations:")
    print("1. Add")
    print("2. Subtract")
    print("3. Multiply")
    print("4. Divide")
    print("5. Power")

    while True:
        try:
            choice = input("Enter operation (1/2/3/4/5) or 'q' to quit: ")
            if choice.lower() == 'q':
                break

            if choice not in ['1', '2', '3', '4', '5']:
                print("Invalid input. Please try again.")
                continue

            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))

            if choice == '1':
                print(f"Result: {add(num1, num2)}")
            elif choice == '2':
                print(f"Result: {subtract(num1, num2)}")
            elif choice == '3':
                print(f"Result: {multiply(num1, num2)}")
            elif choice == '4':
                print(f"Result: {divide(num1, num2)}")
            elif choice == '5':
                print(f"Result: {power(num1, num2)}")

        except ValueError as e:
            print(f"Error: {e}")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    main()