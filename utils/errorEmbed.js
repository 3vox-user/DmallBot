const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = () => {
  return new EmbedBuilder()
    .setAuthor({
      name: "(/) DmallBot (/)",
      iconURL: "https://i.postimg.cc/8PPNy8jB/telechargement.png"
    })
    .setDescription("Une erreur est survenue")
    .setColor(config.ERROREMBEDCOLOR);
};
