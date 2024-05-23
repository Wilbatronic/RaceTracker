const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
		const memberLogFile = path.join(__dirname, '..', 'member.json');
		const memberLog = JSON.parse(fs.readFileSync(memberLogFile, 'utf8'));

		memberLog.push({
			id: member.id,
			username: member.user.username,
			discriminator: member.user.discriminator,
			joinTimestamp: member.joinedAt,
		});

		fs.writeFileSync(memberLogFile, JSON.stringify(memberLog, null, 2));
	},
};