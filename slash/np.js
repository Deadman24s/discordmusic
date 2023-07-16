const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

// now playing, shows current song
module.exports = {
    data: new SlashCommandBuilder()
        .setName("np")
        .setDescription("Displays information about the playing song"),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)
        
        // if no queue, there are no songs
        if(!queue)
            return await interaction.editReply("There are no songs in the queue")

            let bar = queue.createProgressBar({
                queue: false,
                length: 19
            })

            const song = queue.current

            await interaction.editReply({
                embeds: [new EmbedBuilder()
                .setThumbnail(song.thumbnail)
                .setDescription(`Currently Playing [${song.title}](${song.url})\n\n` + bar)
            ],
            })
    },
}