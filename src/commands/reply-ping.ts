import type { CommandInteraction } from "discord.js";
import { database, replyPingUser } from "../mongo.js";

const replyPings = database.collection<replyPingUser>("reply-pings");

const handler = async (interaction: CommandInteraction) => {
  const enable = interaction.options.getBoolean("enable");

  if (enable === null) {
    const arePingsEnabled = (await replyPings.findOne({ name: interaction.user.id }))?.alwaysPing;
    return await interaction.reply({
      content: arePingsEnabled === true ?
                   `I will ping you when someone doesn't mention you in a reply` :
                   `I will not ping you when someone doesn't mention you in a reply`,
      ephemeral: true
    });
  }

  await replyPings.updateOne({ name: interaction.user.id }, { $set: { alwaysPing: enable } }, { upsert: true });
  return await interaction.reply({ content: `Alright! I've ${enable ? "enabled" : "disabled"} your pings`, ephemeral: true });
};

const description = "Change if you should be automatically ping when someone replies without pinging you";

const options = [
  { type: "BOOLEAN", name: "enable", description: "Should you be automatically pinged when someone replies without pinging you?", required: false },
];

export { handler, description, options };
