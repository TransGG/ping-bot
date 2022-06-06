import type { MenuType } from "./menu.js";

export class MenuManager {
  private static _instance: MenuManager;
  private menuTypes: Map<string, MenuType> = new Map();

  private constructor() {}

  public static getInstance(): MenuManager {
    if (!MenuManager._instance) {
      MenuManager._instance = new MenuManager();
    }
    return MenuManager._instance;
  }

  public addMenuType(MenuOptions: MenuType) {
    this.menuTypes.set(MenuOptions.type, MenuOptions);
    // TODO
  }
}
