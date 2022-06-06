import type { CommandInteraction } from "discord.js";

const handler = async (interaction: CommandInteraction) => {
  // TODO: Handle permissions for this command so that any user cannot ping any role
  const role = interaction.options.getRole("role", true);
  console.log(`[Ping bot:/ping] ${interaction.user.tag} (ID ${interaction.user.id}) attempted to ping @${role.name} (ID ${role.id})`);
  await interaction.reply({
    content: `<@&${role.id}>`,
    allowedMentions: { roles: [role.id] },
  });
};

const options = [
  { type: "ROLE", name: "role", description: "The role you want to ping", required: true },
];

const description = "Ping a role";

export { handler, options, description };
