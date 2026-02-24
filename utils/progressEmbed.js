const { EmbedBuilder } = require("discord.js");
const config = require("../config");

function formatTime(ms) {
  if (ms <= 0) return "0s";

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0)
    return `${minutes}m ${seconds}s`;

  return `${seconds}s`;
}

module.exports = (
  success,
  failed,
  processed,
  totalTarget,
  etaMs,
  status = "En cours..."
) => {

  const percent = totalTarget > 0
    ? ((processed / totalTarget) * 100).toFixed(1)
    : 0;

  return new EmbedBuilder()
    .setAuthor({
      name: "(/) DmallBot (/)",
      iconURL: "https://i.postimg.cc/3Nr5bpr6/telechargement1.jpg"
    })
    .setColor(config.EMBEDCOLOR)
    .setTitle("📢 - Progression...")
    .addFields(
      { name: "Succès", value: `\`${success}\``, inline: true },
      { name: "Échecs", value: `\`${failed}\``, inline: true },
      { name: "Total traité", value: `\`${processed}/${totalTarget}\``, inline: true },
      { name: "Progression", value: `\`${percent}%\`` },
      { name: "Temps restant estimé", value: `\`${formatTime(etaMs)}\`` },
      { name: "Statut", value: status }
    )
    .setTimestamp();
};
