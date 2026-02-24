const config = require("../config");
const delay = require("../utils/delay");
const lock = require("../utils/globalLock");
const errorEmbed = require("../utils/errorEmbed");
const progressEmbed = require("../utils/progressEmbed");

module.exports = {
  name: "dmall",

  async execute(client, message, args) {

    if (lock.isActive())
      return message.reply("⚠️ Un DMALL est déjà actif.");

    const content = args.join(" ");
    if (!content)
      return message.reply({ embeds: [errorEmbed()] });

    lock.start();

    let success = 0;
    let failed = 0;
    let processed = 0;

    try {

      await message.guild.members.fetch();

      const membersArray = message.guild.members.cache
        .filter(m => !m.user.bot)
        .map(m => m);

      const totalTarget = Math.min(
        membersArray.length,
        config.MAX_DM_PER_COMMAND
      );

      const progressMsg = await message.reply({
        embeds: [
          progressEmbed(0, 0, 0, totalTarget, totalTarget * config.DELAY)
        ]
      });

      for (const member of membersArray) {

        if (processed >= totalTarget) break;

        try {
          await member.send({
            content: `<@${member.id}>\n\n${content}`
          });
          success++;
        } catch {
          failed++;
        }

        processed++;

        const remaining = totalTarget - processed;
        const eta = remaining * config.DELAY;

        if (processed % config.PROGRESS_UPDATE_EVERY === 0) {
          await progressMsg.edit({
            embeds: [
              progressEmbed(success, failed, processed, totalTarget, eta)
            ]
          });
        }

        await delay(config.DELAY);
      }

      await progressMsg.edit({
        embeds: [
          progressEmbed(success, failed, processed, totalTarget, 0, "✅ Terminé")
        ]
      });

    } catch (err) {

      console.error(err);
      message.reply({ embeds: [errorEmbed()] });

    } finally {
      lock.stop();
    }
  }
};
