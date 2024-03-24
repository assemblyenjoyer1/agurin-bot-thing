import type IEvent from "../interfaces/IEvent";

const messageEvent: IEvent = {
	name: "message",
	execute: (client, commands, channel, userstate, message, self) => {
		if (self) return;

		if (!message.startsWith("!")) return;
		message = message.slice(1);
		
		const args = message.split(" ");
		const commandName = args.shift()?.toLowerCase();

		if (!commandName) return;

		const command = commands.get(commandName);

		if (!command) return;

		command.execute(client, commands, channel, userstate, message, self, ...args);
	}
};

export default messageEvent;