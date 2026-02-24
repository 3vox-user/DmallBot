// By 3vox

const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials
} = require("discord.js");

const fs = require("fs");
const config = require("./config");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));
for (const file of commandFiles) {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.name, cmd);
}

client.once("clientReady", () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {

  if (!message.guild) return;
  if (message.author.bot) return;
  if (!message.content.startsWith(config.BOTPREFIX)) return;
  if (!config.BOTOWNERID.includes(message.author.id)) return;

  const args = message.content.slice(config.BOTPREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(client, message, args);
  } catch (err) {
    console.error(err);
  }
});

client.login(config.BOTTOKEN);
