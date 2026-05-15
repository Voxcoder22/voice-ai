import json
import os

class TodoList:
    def __init__(self, filename="todo_list.json"):
        self.filename = filename
        self.tasks = []
        self.load_tasks()

    def load_tasks(self):
        if os.path.exists(self.filename):
            with open(self.filename, "r") as file:
                self.tasks = json.load(file)

    def save_tasks(self):
        with open(self.filename, "w") as file:
            json.dump(self.tasks, file, indent=4)

    def add_task(self, task):
        self.tasks.append({"task": task, "completed": False, "stories": []})
        self.save_tasks()

    def complete_task(self, index):
        if 0 <= index < len(self.tasks):
            self.tasks[index]["completed"] = True
            self.save_tasks()

    def delete_task(self, index):
        if 0 <= index < len(self.tasks):
            del self.tasks[index]
            self.save_tasks()

    def list_tasks(self):
        for i, task in enumerate(self.tasks):
            status = "✓" if task["completed"] else "✗"
            print(f"{i}. [{status}] {task['task']}")

    def add_story(self, index, story):
        if 0 <= index < len(self.tasks):
            self.tasks[index]["stories"].append(story)
            self.save_tasks()

    def list_stories(self, index):
        if 0 <= index < len(self.tasks):
            if self.tasks[index]["stories"]:
                print(f"Stories for task '{self.tasks[index]['task']}':")
                for i, story in enumerate(self.tasks[index]["stories"]):
                    print(f"{i}. {story}")
            else:
                print(f"No stories found for task '{self.tasks[index]['task']}'")

def main():
    todo_list = TodoList()

    while True:
        print("\nTo-Do List Menu:")
        print("1. Add Task")
        print("2. Complete Task")
        print("3. Delete Task")
        print("4. List Tasks")
        print("5. Add Story to Task")
        print("6. List Stories for Task")
        print("7. Exit")

        choice = input("Enter your choice: ")

        if choice == "1":
            task = input("Enter the task: ")
            todo_list.add_task(task)
        elif choice == "2":
            index = int(input("Enter the task index to complete: "))
            todo_list.complete_task(index)
        elif choice == "3":
            index = int(input("Enter the task index to delete: "))
            todo_list.delete_task(index)
        elif choice == "4":
            todo_list.list_tasks()
        elif choice == "5":
            index = int(input("Enter the task index to add a story: "))
            story = input("Enter the story: ")
            todo_list.add_story(index, story)
        elif choice == "6":
            index = int(input("Enter the task index to list stories: "))
            todo_list.list_stories(index)
        elif choice == "7":
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()