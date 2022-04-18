import { Client, ClientOptions } from "discord.js";
import { CommandManager } from "./discord/commandManager.js";
import { MenuManager } from "./discord/menuManager.js";
import { Framework, frameworkConfig } from "./framework.js";

export default Framework;
export { Framework, Client, ClientOptions, CommandManager, MenuManager, frameworkConfig };
