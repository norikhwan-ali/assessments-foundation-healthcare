import { expect, type Locator, type Page } from "@playwright/test";

export class TodoPage {
  readonly checkboxes: Locator;
  readonly input: Locator;
  readonly todoCount: Locator;
  readonly todoItems: Locator;

  constructor(readonly page: Page) {
    this.checkboxes = page.locator("ul.todo-list li input.toggle");
    this.input = page.locator("input.new-todo");
    this.todoCount = page.locator("span.todo-count");
    this.todoItems = page.locator("ul.todo-list li");
  }

  // Dynamic Locators

  checkbox(index: number): Locator {
    return this.todoItems.nth(index).locator("input.toggle");
  }

  destroyButton(index: number): Locator {
    return this.todoItems.nth(index).locator("button.destroy");
  }

  filter(option: "All" | "Active" | "Completed"): Locator {
    return this.page.locator(`ul.filters li a:has-text("${option}")`);
  }

  label(index: number): Locator {
    return this.todoItems.nth(index).locator("label");
  }

  // Actions

  async addTodo(text: string): Promise<void> {
    await this.input.fill(text);
    await this.input.press("Enter");
  }

  async deleteTodo(index: number): Promise<void> {
    const item = this.todoItems.nth(index);
    await item.hover();
    await this.destroyButton(index).click();
  }

  async filterBy(filter: "All" | "Active" | "Completed"): Promise<void> {
    await this.filter(filter).click();
  }

  async goto(): Promise<void> {
    await this.page.goto(process.env.UI_BASE_URL!);
  }

  async toggleTodo(index: number): Promise<void> {
    await this.checkbox(index).check();
  }

  // Getters

  async expectPageScreenshot(name: string) {
    const app = this.page.locator(".todoapp");
    await this.page.waitForLoadState("networkidle");
    await expect(app).toHaveScreenshot(name);
  }

  async getActiveTodosCount(): Promise<number> {
    const text = (await this.todoCount.textContent()) ?? "0";
    const match = text.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }

  async isTodoCompleted(index: number): Promise<boolean> {
    return this.todoItems
      .nth(index)
      .evaluate((el) => el.classList.contains("completed"));
  }
}
