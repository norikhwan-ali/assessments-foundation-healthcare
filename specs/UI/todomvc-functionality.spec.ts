import { test, expect } from "@playwright/test";
import { TodoPage } from "../../pages";
import { ToDos } from "../../data";

let todoPage: TodoPage;

test.describe("TodoMVC Test Application", () => {
  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test.describe("Initial (empty) state", () => {
    test("should display the correct initial state of the application", async () => {
      await expect(todoPage.input).toBeVisible();
      await expect(todoPage.input).toBeEmpty();
    });
  });

  test.describe("Add a single item", () => {
    test("should add a single item and verify it appears in the list", async () => {
      await todoPage.addTodo(ToDos[0]);
      await expect(todoPage.todoItems).toHaveCount(1);
      await expect(todoPage.label(0)).toHaveText(ToDos[0]);
    });
  });

  test.describe("Add multiple items", () => {
    test("should add multiple items and verify the item count", async () => {
      for (const todo of ToDos) {
        await todoPage.addTodo(todo);
      }

      await expect(todoPage.todoItems).toHaveCount(3);
      const activeCount = await todoPage.getActiveTodosCount();
      expect(activeCount).toBe(3);
    });
  });

  test.describe("Mark item as complete", () => {
    test("should mark an item as complete and verify the visual state", async () => {
      await todoPage.addTodo(ToDos[0]);
      await todoPage.toggleTodo(0);

      // Verify the item is completed and its visual state
      const isCompleted = await todoPage.isTodoCompleted(0);
      expect(isCompleted).toBe(true);
      await expect(todoPage.checkbox(0)).toBeChecked();
      const todoLabel = todoPage.label(0);
      await expect(todoLabel).toHaveCSS("text-decoration-line", "line-through");
      const activeCount = await todoPage.getActiveTodosCount();
      expect(activeCount).toBe(0);
    });
  });

  test.describe("Delete an item", () => {
    test("should delete an item and verify it is removed", async () => {
      for (const todo of ToDos) {
        await todoPage.addTodo(todo);
      }

      // Verify initial item count
      await expect(todoPage.todoItems).toHaveCount(3);

      // Delete item 2 and verify the remaining items
      await todoPage.deleteTodo(1);
      await expect(todoPage.todoItems).toHaveCount(2);
      await expect(todoPage.label(0)).toHaveText("Clean the house");
      await expect(todoPage.label(1)).toHaveText("Finish assignment");
    });
  });

  test.describe("Filter todo list", () => {
    test("should filter by Active, Completed, and All", async () => {
      for (const todo of ToDos) {
        await todoPage.addTodo(todo);
      }

      // Mark item 3 as completed
      await todoPage.toggleTodo(2);

      // Filter by All
      await todoPage.filterBy("All");
      await expect(todoPage.todoItems).toHaveCount(3);

      // Filter by Active
      await todoPage.filterBy("Active");
      await expect(todoPage.todoItems).toHaveCount(2);

      // Filter by Completed
      await todoPage.filterBy("Completed");
      await expect(todoPage.todoItems).toHaveCount(1);
      await expect(todoPage.label(0)).toHaveText("Finish assignment");

      // Go back to All
      await todoPage.filterBy("All");
      await expect(todoPage.todoItems).toHaveCount(3);
    });
  });
});
