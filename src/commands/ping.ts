import type { CommandInteraction } from "discord.js";

const handler = async (interaction: CommandInteraction) => {
  console.log(`[Ping bot:/ping] The /ping command was executed!`)
  await interaction.reply("/ping command executed");
};

export { handler };
