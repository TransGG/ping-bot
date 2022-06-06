import { Client, ClientOptions, ActivityType } from "discord.js";
import { CommandManager } from "./discord/commandManager.js";
import { MenuManager } from "./discord/menuManager.js";
import { Framework, frameworkConfig } from "./framework.js";

const client = new Client({
  allowedMentions: { parse: [], repliedUser: true },
  presence: { activities: [{ name: "to your pings", type: ActivityType.LISTENING }] },
  intents: ["GUILD_MESSAGES"],
});

client.login(process.env["token"]);
