const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, Message } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the currently playing song"),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)
        
        // if no queue, there are no songs
        if(!queue)
            return await interaction.editReply("There are no songs in the queue")

            const currentSong = queue.current

            queue.skip()
            await interaction.editReply({
                embeds: [
                    new MessageEmbed().setDescription(`${currentSong.title} has been skipped!`).setThumbnail(currentSong.thumbnail)
                ]
            })
    }
}