import type { Client, Message } from "discord.js";
import { database, replyPingUser } from "../mongo.js";

const replyPings = database.collection<replyPingUser>("reply-pings");

const handler = async (client: Client, message: Message) => {
  if (message.type !== "REPLY") return;
  if (message.author.id === client.user?.id) return;
  if (message.author.id === message.mentions.repliedUser?.id) return;

  if (message.mentions.has(message.mentions.repliedUser!)) return;

  const arePingsEnabled = (await replyPings.findOne({ name: message.mentions.repliedUser?.id }))?.alwaysPing;
  if (!arePingsEnabled) return;

  await message.reply({ content: `<@${message.mentions.repliedUser?.id}>`, allowedMentions: { users: [message.mentions.repliedUser!.id] } })
}

export { handler };
