const Discord = require("discord.js")
const dotenv = require("dotenv")
// set up discord slash commands
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
// read files
const fs = require("fs")
// manage queue and other features
const { Player } = require("discord-player")
//const { Client, GatewayIntentBits,} = require('discord.js')
const { Client, GatewayIntentBits } = require("discord.js")


dotenv.config()
const TOKEN = process.env.TOKEN

// bool looks at command arguments when running code
const LOAD_SLASH = process.argv[2] == "load"

// client and guild id to deploy slash commands - from discord bot id
const CLIENT_ID = "Bot ID"
const GUILD_ID = "Server ID"

const client = new Discord.Client({
    intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
    ]
})

client.slashcommands = new Discord.Collection()
// youtube downloader handles music stream
client.player = new Player(client,{
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

// create array to deploy slash commands
let commands = []

// grab slash files and filter by .js 
const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))

// loop through files
for (const file of slashFiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

// only load slash commands, use REST api 
if (LOAD_SLASH) {
    const rest = new REST({ version: "9" }).setToken(TOKEN)
    console.log("Deploying slash commands")
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
    .then(() => {
        console.log("Successfully loaded")
        process.exit(0)
    })
    // if there is an error, logs it and ends program
    .catch((err) => {
        if (err){
            console.log(err)
            process.exit(1)
        }
    })
}
else {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`)
    })
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return

            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply("Not a valid slash command")

            await interaction.deferReply()
            await slashcmd.run({ client, interaction })
        }
        handleCommand()
    })
    client.login(TOKEN)
}