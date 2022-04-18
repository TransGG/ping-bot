import { Client, ClientOptions } from "discord.js";
import { MongoClient } from "mongodb";
import { CommandManager } from "./discord/commandManager.js";
import { MenuManager } from "./discord/menuManager.js";

export interface frameworkConfig {
  ClientOptions: ClientOptions;
  ProjectName: string;
  token: string;
  mongo: MongoClient | string;
  devMode?: boolean;
}

export class Framework {
  private static frameworkInstance: Framework;
  public fconfig: frameworkConfig;
  public client: Client;
  public commandManager: CommandManager;
  public menuManager: MenuManager;
  public mongoClient!: MongoClient;

  private constructor(config: frameworkConfig) {
    this.fconfig = config;
    this.client = new Client(this.fconfig.ClientOptions);
    this.commandManager = new CommandManager(this.client);
    this.menuManager = MenuManager.getInstance();
  }

  public static async initFramework(frameworkConfig: frameworkConfig) {
    if (this.frameworkInstance) {
      console.error("Framework is already initialized, ignoring initFramework call");
      return;
    }

    let frameworkInstance = new Framework(frameworkConfig);

    if (typeof frameworkInstance.fconfig.mongo === "string") {
      MongoClient.connect(frameworkInstance.fconfig.mongo).then((mclient) => {
        frameworkInstance.mongoClient = mclient;
      });
    } else {
      frameworkInstance.mongoClient = frameworkInstance.fconfig.mongo;
    }

    Framework.frameworkInstance = frameworkInstance;
  }

  public static async getFramework() {
    if (!Framework.frameworkInstance) throw "You must call initFramework before calling getFramework";
    return Framework.frameworkInstance;
  }

  public async connect() {
    if (!Framework.frameworkInstance) throw "You must call initFramework before calling connect";
    await Framework.frameworkInstance.client.login(Framework.frameworkInstance.fconfig.token);
  }
}
