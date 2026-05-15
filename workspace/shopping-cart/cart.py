class ShoppingCart:
    def __init__(self):
        self.items = []

    def add_item(self, name, price):
        self.items.append({"name": name, "price": price})
        print(f"Added {name} to cart.")

    def remove_item(self, name):
        for item in self.items:
            if item["name"] == name:
                self.items.remove(item)
                print(f"Removed {name} from cart.")
                return
        print(f"{name} not found in cart.")

    def view_cart(self):
        if not self.items:
            print("Your cart is empty.")
        else:
            print("Items in your cart:")
            for item in self.items:
                print(f"{item['name']}: ${item['price']:.2f}")

    def calculate_total(self):
        return sum(item["price"] for item in self.items)

    def save_cart(self, filename):
        with open(filename, 'w') as f:
            for item in self.items:
                f.write(f"{item['name']},{item['price']}\n")
        print(f"Cart saved to {filename}")

    def load_cart(self, filename):
        try:
            with open(filename, 'r') as f:
                self.items = []
                for line in f:
                    name, price = line.strip().split(',')
                    self.add_item(name, float(price))
            print(f"Cart loaded from {filename}")
        except FileNotFoundError:
            print(f"File {filename} not found.")
        except Exception as e:
            print(f"Error loading cart: {e}")