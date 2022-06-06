import type { CommandInteraction } from "discord.js";

const handler = (_interaction: CommandInteraction) => {
  console.log("[Ping bot:/replyPing] Command executed");
};

export { handler };
