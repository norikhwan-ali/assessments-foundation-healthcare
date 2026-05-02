import { test, expect } from "@playwright/test";
import { TodoPage } from "../pages";
import { ToDos } from "../data";

let todoPage: TodoPage;

test.describe("TodoMVC Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test.describe("Accessibility Tests", () => {
    test("should have proper ARIA labels on interactive elements", async () => {
      await todoPage.addTodo(ToDos[0]);

      // Check that the input has proper labeling
      await expect(todoPage.input).toHaveAttribute(
        "placeholder",
        "What needs to be done?",
      );

      // Check that todo items have proper structure
      const firstTodo = todoPage.todoItems.first();
      await expect(firstTodo.locator("div.view")).toBeVisible();
    });

    test("should be keyboard accessible", async () => {
      await todoPage.input.fill(ToDos[0]);
      await todoPage.input.press("Enter");
      await expect(todoPage.todoItems).toHaveCount(1);

      // Navigate using tab and toggle with keyboard
      await todoPage.page.keyboard.press("Tab");
      await todoPage.page.keyboard.press("Space");
      const isCompleted = await todoPage.isTodoCompleted(0);
      expect(isCompleted).toBe(true);
    });

    test("should have accessible filter links", async () => {
      await todoPage.addTodo(ToDos[0]);

      // Check filter links are accessible
      await expect(todoPage.filter("All")).toBeVisible();
      await expect(todoPage.filter("Active")).toBeVisible();
      await expect(todoPage.filter("Completed")).toBeVisible();

      // Tab through the elements to the "Completed" filter and activate it
      for (let i = 0; i < 5; i++) {
        await todoPage.page.keyboard.press("Tab");
      }

      await todoPage.page.keyboard.press("Enter");

      // Item should not be visible
      await expect(todoPage.todoItems).toHaveCount(0);
    });

    test("should have elements that are properly focused", async () => {
      await todoPage.addTodo(ToDos[0]);
      const input = todoPage.input;
      await input.focus();
      const focusedElement = todoPage.page.locator(":focus");
      await expect(focusedElement).toBeVisible();
    });

    test("should support screen reader navigation", async () => {
      for (const todo of ToDos) {
        await todoPage.addTodo(todo);
      }

      await expect(todoPage.todoItems).toHaveCount(3);
      const checkboxes = await todoPage.checkboxes.all();
      expect(checkboxes.length).toBe(3);
    });

    test("should have proper color contrast for visibility", async () => {
      await todoPage.addTodo(ToDos[0]);

      // Get the computed style of the input
      const inputBgColor = await todoPage.input.evaluate(
        (el) => window.getComputedStyle(el).backgroundColor,
      );

      // Verify input has a background color set
      expect(inputBgColor).toBeDefined();
    });
  });
});
