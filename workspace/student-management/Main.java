import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        StudentManagementSystem sms = new StudentManagementSystem();
        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.println("\nStudent Management System");
            System.out.println("1. Add Student");
            System.out.println("2. Remove Student");
            System.out.println("3. Update Student");
            System.out.println("4. View All Students");
            System.out.println("5. Exit");
            System.out.print("Enter your choice: ");

            int choice = scanner.nextInt();
            scanner.nextLine(); // Consume newline

            switch (choice) {
                case 1:
                    System.out.print("Enter student name: ");
                    String name = scanner.nextLine();
                    System.out.print("Enter student ID: ");
                    int id = scanner.nextInt();
                    scanner.nextLine(); // Consume newline
                    System.out.print("Enter student department: ");
                    String department = scanner.nextLine();
                    sms.addStudent(new Student(name, id, department));
                    System.out.println("Student added successfully.");
                    break;
                case 2:
                    System.out.print("Enter student ID to remove: ");
                    int removeId = scanner.nextInt();
                    sms.removeStudent(removeId);
                    System.out.println("Student removed successfully.");
                    break;
                case 3:
                    System.out.print("Enter student ID to update: ");
                    int updateId = scanner.nextInt();
                    scanner.nextLine(); // Consume newline
                    System.out.print("Enter new name: ");
                    String newName = scanner.nextLine();
                    System.out.print("Enter new department: ");
                    String newDepartment = scanner.nextLine();
                    sms.updateStudent(updateId, newName, newDepartment);
                    System.out.println("Student updated successfully.");
                    break;
                case 4:
                    System.out.println("List of all students:");
                    for (Student student : sms.getAllStudents()) {
                        System.out.println(student);
                    }
                    break;
                case 5:
                    System.out.println("Exiting...");
                    scanner.close();
                    System.exit(0);
                default:
                    System.out.println("Invalid choice. Please try again.");
            }
        }
    }
}