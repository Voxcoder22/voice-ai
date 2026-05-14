import java.util.ArrayList;
import java.util.List;

public class ShoppingCart {
    private List<Product> items;

    public ShoppingCart() {
        this.items = new ArrayList<>();
    }

    public void addItem(Product product) {
        items.add(product);
    }

    public void removeItem(Product product) {
        items.remove(product);
    }

    public List<Product> getItems() {
        return new ArrayList<>(items);
    }

    public double getTotalPrice() {
        return items.stream()
                .mapToDouble(Product::getPrice)
                .sum();
    }

    public void clear() {
        items.clear();
    }
}