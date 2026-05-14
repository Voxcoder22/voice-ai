public class ShoppingCartManager {
    public static void main(String[] args) {
        // Create some products
        Product apple = new Product("Apple", 0.99);
        Product banana = new Product("Banana", 0.59);
        Product orange = new Product("Orange", 1.09);

        // Create a shopping cart
        ShoppingCart cart = new ShoppingCart();

        // Add items to the cart
        cart.addItem(apple);
        cart.addItem(banana);
        cart.addItem(orange);

        // Display cart contents
        System.out.println("Shopping Cart Contents:");
        for (Product item : cart.getItems()) {
            System.out.println(item);
        }

        // Display total price
        System.out.println("Total Price: $" + cart.getTotalPrice());

        // Remove an item
        cart.removeItem(banana);

        // Display updated cart contents
        System.out.println("\nAfter removing Banana:");
        for (Product item : cart.getItems()) {
            System.out.println(item);
        }

        // Display updated total price
        System.out.println("Total Price: $" + cart.getTotalPrice());

        // Clear the cart
        cart.clear();

        // Display empty cart
        System.out.println("\nAfter clearing the cart:");
        System.out.println("Cart is empty: " + cart.getItems().isEmpty());
    }
}