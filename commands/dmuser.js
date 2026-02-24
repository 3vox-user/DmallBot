const errorEmbed = require("../utils/errorEmbed");

module.exports = {
  name: "dmuser",

  async execute(client, message, args) {

    const user =
      message.mentions.users.first() ||
      await client.users.fetch(args[0]).catch(() => null);

    if (!user)
      return message.reply({ embeds: [errorEmbed()] });

    const content = args.slice(1).join(" ");
    if (!content)
      return message.reply({ embeds: [errorEmbed()] });

    try {
      await user.send({
        content: `<@${user.id}>\n\n${content}`
      });

      message.react("✅");

    } catch {
      message.reply({ embeds: [errorEmbed()] });
    }
  }
};
