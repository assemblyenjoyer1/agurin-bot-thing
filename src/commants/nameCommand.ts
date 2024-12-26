import { sleep } from "bun";
import type IEvent from "../interfaces/IEvent";

const euwaccCommand: IEvent = {
  name: "euwacc",
  execute: async (client, commands, channel, userstate, message, self) => {
    if (self) return;

    const args = message.split(" ");

    try {
      sleep(1);
      const name = "Stylendo#3UW";

      client.say(channel, name);
    } catch (error) {
      client.say(channel, "An error occurred while fetching the data.");
    }
  },
};

export default euwaccCommand;
