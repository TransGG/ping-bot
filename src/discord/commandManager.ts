import type {
  ApplicationCommandManager,
  ApplicationCommandPermissionData,
  ChatInputApplicationCommandData,
  Client,
  CommandInteraction,
  GuildApplicationCommandManager,
} from "discord.js";

/**
 * Command Options
 */
export interface cmdOpts {
  command: ChatInputApplicationCommandData;
  permissions?: ApplicationCommandPermissionData[];
  handler: (cmd: CommandInteraction) => any;
}

/**
 * manages discord commands
 */
export class CommandManager {
  commands: ChatInputApplicationCommandData[] = [];
  permissions: { [key: string]: ApplicationCommandPermissionData[] } = {};
  bot: Client<true>;
  handlers: { [key: string]: (interaction: CommandInteraction) => void };
  constructor(bot: Client) {
    this.handlers = {};
    this.bot = bot;

    this.bot.on("interaction", (interaction) => {
      if (interaction.isCommand()) {
        this.handle(interaction);
      }
    });
  }

  /**
   * adds a command to the bot
   * @param cmdOpts command to add
   */
  async addCmd(cmdOpts: cmdOpts) {
    console.log("adding command: " + cmdOpts.command.name);
    this.handlers[cmdOpts.command.name] = cmdOpts.handler.bind(this);
    this.commands.push(cmdOpts.command);
    if (cmdOpts.permissions) {
      this.permissions[cmdOpts.command.name] = cmdOpts.permissions;
    }
  }

  /**
   * registers all added commands
   * @param serverId server id to register commands to, if ommited commands will be registered globally and permissions will be ignored
   */
  async registerCommands(serverId?: string) {
    if (serverId) {
      // add guild specific commands
      let guild = await this.bot.guilds.fetch(serverId);
      if (!guild) {
        let err = new Error(`Could not find guild with id ${serverId}`);
        console.error(err);
        return;
      }

      let cmdManager: GuildApplicationCommandManager = guild.commands;
      let cmds = await cmdManager.set(this.commands);

      cmds.forEach((cmd) => {
        let perms = this.permissions[cmd.name];
        if (perms) {
          cmd.permissions.set({ permissions: perms });
        }
      });
    } else {
      // add global commands
      var cmdManager: ApplicationCommandManager = this.bot.application.commands;
      await cmdManager.set(this.commands);
    }
  }

  /**
   * handles a command interaction
   * @param cmd command interaction
   */
  async handle(cmd: CommandInteraction) {
    if (!cmd.command?.name) return;
    let handler = this.handlers[cmd.command.name];
    if (handler) {
      try {
        handler(cmd);
      } catch (error) {
        try {
          var jsonCmd = JSON.stringify(cmd);
        } catch (error) {
          var jsonCmd = "could not stringify command";
        }

        console.error(`Command handler threw error while handling command: \n${jsonCmd} \nError: \n${error}`);
      }
    }
  }
}
