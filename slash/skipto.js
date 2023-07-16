const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("SKip to a certain track #")
        .addNumberOption((option) => 
            option.setName("tracknumber").setDescription("The track to skip to").setMinValue(1).setRequired(true)),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)
        
        // if no queue, there are no songs
        if(!queue)
            return await interaction.editReply("There are no songs in the queue")

            const trackNum = interaction.option.getNumber("tracknumber")
            if(trackNum > queue.tracks.length)
                return await interaction.editReply("Invalid track number")

            queue.skipTo(trackNum - 1)
            await interaction.editReply(`Skipped to track number ${trackNum}`)
    }
}