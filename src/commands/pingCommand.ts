import type IEvent from "../interfaces/IEvent";

const pingCommand: IEvent = {
  name: "ping",
  execute: (client, commands, channel, userstate, message, self) => {
    if (self) return;

    client.say(channel, "Pong!");
    console.log("Pong!");
  },
};

export default pingCommand;
