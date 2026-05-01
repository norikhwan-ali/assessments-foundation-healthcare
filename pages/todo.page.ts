import { expect, type Locator, type Page } from "@playwright/test";

export class TodoPage {
  readonly checkboxes: Locator;
  readonly clearCompleted: Locator;
  readonly footer: Locator;
  readonly input: Locator;
  readonly todoCount: Locator;
  readonly todoItems: Locator;

  constructor(readonly page: Page) {
    this.checkboxes = page.locator("ul.todo-list li input.toggle");
    this.clearCompleted = page.locator("button.clear-completed");
    this.footer = page.locator("footer.footer");
    this.input = page.locator("input.new-todo");
    this.todoCount = page.locator("span.todo-count");
    this.todoItems = page.locator("ul.todo-list li");
  }

  // ---------------------------
  // Dynamic Locators (per item)
  // ---------------------------

  label(index: number): Locator {
    return this.todoItems.nth(index).locator("label");
  }

  checkbox(index: number): Locator {
    return this.todoItems.nth(index).locator("input.toggle");
  }

  destroyButton(index: number): Locator {
    return this.todoItems.nth(index).locator("button.destroy");
  }

  filter(option: "All" | "Active" | "Completed"): Locator {
    return this.page.locator(`ul.filters li a:has-text("${option}")`);
  }

  // ---------------------------
  // Actions
  // ---------------------------

  async goto(): Promise<void> {
    await this.page.goto(process.env.UI_BASE_URL!);
  }

  async addTodo(text: string): Promise<void> {
    await this.input.fill(text);
    await this.input.press("Enter");
  }

  async toggleTodo(index: number): Promise<void> {
    await this.checkbox(index).check();
  }

  async deleteTodo(index: number): Promise<void> {
    const item = this.todoItems.nth(index);
    await item.hover();
    await this.destroyButton(index).click();
  }

  async filterBy(filter: "All" | "Active" | "Completed"): Promise<void> {
    await this.filter(filter).click();
  }

  async clearAllCompleted(): Promise<void> {
    await this.clearCompleted.click();
  }

  // ---------------------------
  // Getters
  // ---------------------------

  async getTodoText(index: number): Promise<string> {
    const text = await this.label(index).textContent();
    return text ?? "";
  }

  // async getTodoCount(): Promise<number> {
  //   return this.todoItems.count();
  // }

  async isTodoCompleted(index: number): Promise<boolean> {
    return this.todoItems
      .nth(index)
      .evaluate((el) => el.classList.contains("completed"));
  }

  async getActiveTodosCount(): Promise<number> {
    const text = (await this.todoCount.textContent()) ?? "0";
    const match = text.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }

  async expectPageScreenshot(name: string) {
    await expect(this.page.locator("body")).toHaveScreenshot(name);
  }
}
