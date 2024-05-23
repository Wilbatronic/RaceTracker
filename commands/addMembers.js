const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addmembers')
		.setDescription('Add or update members in the database')
		.setDefaultPermission(false),
	async execute(interaction) {
		// Check if the user has permission to run the command
		if (!interaction.member.permissions.has('ADMINISTRATOR')) {
			return interaction.reply({ content: 'You do not have permission to run this command.', ephemeral: true });
		}

		// Get the guild members
		const guild = interaction.guild;
		const members = await guild.members.fetch();

		// Read the existing member data from the JSON file
		let memberData;
		try {
			const dataString = fs.readFileSync('members.json', 'utf8');
			memberData = JSON.parse(dataString);
		} catch (err) {
			console.error(err);
			memberData = [];
		}

		// Write the updated member data to the JSON file
		const updatedMemberData = [];
		members.forEach(member => {
			const existingMember = memberData.find(m => m.id === member.id);
			if (existingMember) {
				// Update the existing member's information
				existingMember.username = member.user.username;
				existingMember.discriminator = member.user.discriminator;
				existingMember.joined_at = member.joinedAt;
				existingMember.role_ids = member.roles.cache.map(role => role.id);
			} else {
				// Add a new member to the array
				updatedMemberData.push({
					id: member.id,
					username: member.user.username,
					discriminator: member.user.discriminator,
					joined_at: member.joinedAt,
					roles: member.roles.cache.map(role => role.id),
				});
			}
		});
		fs.writeFileSync('members.json', JSON.stringify(updatedMemberData, null, 2));

		// Reply to the interaction
		interaction.reply({ content: 'Members added or updated in the database.', ephemeral: true });
	},
};