from cart import ShoppingCart

def main():
    cart = ShoppingCart()

    while True:
        print("\nShopping Cart Menu:")
        print("1. Add Item")
        print("2. Remove Item")
        print("3. View Cart")
        print("4. Calculate Total")
        print("5. Save Cart")
        print("6. Load Cart")
        print("7. Exit")

        choice = input("Enter your choice: ")

        if choice == "1":
            item_name = input("Enter item name: ")
            item_price = float(input("Enter item price: "))
            cart.add_item(item_name, item_price)
        elif choice == "2":
            item_name = input("Enter item name to remove: ")
            cart.remove_item(item_name)
        elif choice == "3":
            cart.view_cart()
        elif choice == "4":
            total = cart.calculate_total()
            print(f"Total: ${total:.2f}")
        elif choice == "5":
            filename = input("Enter filename to save cart: ")
            cart.save_cart(filename)
        elif choice == "6":
            filename = input("Enter filename to load cart: ")
            cart.load_cart(filename)
        elif choice == "7":
            print("Exiting...")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()