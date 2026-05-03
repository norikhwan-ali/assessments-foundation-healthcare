import { test, expect } from "@playwright/test";
import { TodoPage } from "../../pages";
import { ToDos } from "../../data";

let todoPage: TodoPage;

test.describe("TodoMVC Visual Regression Tests", () => {
  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test("should display the correct initial visual state of the application", async () => {
    await todoPage.page.waitForLoadState("networkidle");
    await todoPage.expectPageScreenshot("initial-state.png");
  });

  test("should visually render a single added todo item", async () => {
    await todoPage.addTodo(ToDos[0]);
    await todoPage.page.waitForLoadState("networkidle");
    await todoPage.expectPageScreenshot("single-todo-item.png");
  });

  test("should visually render multiple added todos", async () => {
    for (const todo of ToDos) {
      await todoPage.addTodo(todo);
    }

    await todoPage.page.waitForLoadState("networkidle");
    await todoPage.expectPageScreenshot("multiple-todo-items.png");
  });

  test("should visually render a completed todo item", async () => {
    await todoPage.addTodo(ToDos[0]);
    await todoPage.toggleTodo(0);
    await todoPage.page.waitForLoadState("networkidle");
    await todoPage.expectPageScreenshot("completed-todo-item.png");
  });

  test("should visually render deleting a todo item", async () => {
    for (const todo of ToDos) {
      await todoPage.addTodo(todo);
    }

    await todoPage.deleteTodo(1);
    await todoPage.page.waitForLoadState("networkidle");
    await todoPage.expectPageScreenshot("deleted-todo-item.png");
  });

  test("should visually render filtered todo states", async () => {
    for (const todo of ToDos) {
      await todoPage.addTodo(todo);
    }

    await todoPage.toggleTodo(2);

    await todoPage.filterBy("All");
    await todoPage.page.waitForLoadState("networkidle");
    await todoPage.expectPageScreenshot("filtered-all-todos.png");

    await todoPage.filterBy("Active");
    await todoPage.page.waitForLoadState("networkidle");
    await todoPage.expectPageScreenshot("filtered-active-todos.png");

    await todoPage.filterBy("Completed");
    await todoPage.page.waitForLoadState("networkidle");
    await todoPage.expectPageScreenshot("filtered-completed-todos.png");
  });
});
