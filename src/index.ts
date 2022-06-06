import { Client } from 'discord.js';
import type { CommandInteraction, ApplicationCommandOptionData, ApplicationCommandPermissionData } from "discord.js";
import { CommandManager } from "./discord/commandManager.js";
// import { MenuManager } from "./discord/menuManager.js";
// import { Framework, frameworkConfig } from "./framework.js";

const client = new Client({
  allowedMentions: { parse: [], repliedUser: true },
  presence: { activities: [{ name: "your pings", type: "LISTENING" }] },
  intents: ["GUILD_MESSAGES"],
});

const commands = [
  "ping",  // Ping a role
//  "role",  // Add yourself to a self-assignable role
//  "createRole",  // Create a self-assignable role
//  "grant",  // Grant someone a permission (to ping a role or to assign a role)
//  "revoke",  // Revoke someone's permission (to ping a role or to assign a role)
//  "replyPing",  // Set if you want to always be pinged when someone replies to you (ignores self & *does not* reply to a bot reply (provide message link maybe?))
];

const commandManager = new CommandManager(client);

client.once("ready", async () => {
  console.log(`[Ping bot:index] I've logged in as ${client.user?.tag} (ID: ${client.user?.id})`);
  console.log(`[Ping bot:index] Adding commands to the command manager...`);

  for (let command of commands) {
    console.log(`[Ping bot: index] Adding '/${command}' command`);
    const {
      handler,
      description,
      options,
      permissions,
      defaultPermission,
    } = await import(`./commands/${command}.js`) as {
      handler: (interaction: CommandInteraction) => Promise<any>,
      description: string | undefined,
      options: ApplicationCommandOptionData[] | undefined,
      permissions: ApplicationCommandPermissionData[] | undefined,
      defaultPermission: boolean | undefined,
    };
    commandManager.addCmd({
      command: { name: command, description: description ?? "No description", type: "CHAT_INPUT", options: options ?? [], defaultPermission: defaultPermission ?? true },
      permissions: permissions as ApplicationCommandPermissionData[],
      handler: handler,
    });
  }

  console.log(`[Ping bot:index] Registering commands with discord...`);

  await commandManager.registerCommands(process.env["devServer"] ?? undefined);

  console.log(`[Ping bot:index] Registered all commands, we're good to go!`);

  client.on("ready", () => {
    console.log(`[Ping bot: index] Reconnected to discord as ${client.user?.tag} (ID: ${client.user?.id})`)
  });
});

client.login(process.env["token"]);
