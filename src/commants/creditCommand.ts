import type IEvent from "../interfaces/IEvent";

const creditCommand: IEvent = {
  name: "credit",
  execute: (client, commands, channel, userstate, message, self) => {
    if (self) return;

    client.say(channel, "Thanks to tactics.tools for the data!");
    console.log("Pong!");
  }
};

export default creditCommand;