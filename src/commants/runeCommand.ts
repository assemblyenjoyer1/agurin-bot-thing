import type IEvent from "../interfaces/IEvent";
import fs from "fs";
import path from "path";

const jsonFilePath = path.resolve("./data/userAccountByStreamer.json");

const loadDefaultMappings = () => {
  return JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
};

const setAccountForChannel = async (
  channel: string,
  name: string,
  tag: string
) => {
  try {
    const jsonData = loadDefaultMappings();
    jsonData[channel] = { name, tag };
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
    console.log(
      `Mapping added/updated for channel ${channel}: ${name} - ${tag}`
    );

    refreshDefaultMappings();
  } catch (error) {
    console.error(`Error adding/updating mapping: ${error}`);
  }
};

let defaultMappings: { [channel: string]: { name: string; tag: string } };

const refreshDefaultMappings = () => {
  defaultMappings = loadDefaultMappings();
};

refreshDefaultMappings();

const runeCommand: IEvent = {
  name: "rune2",
  execute: async (client, commands, channel, userstate, message, self) => {
    if (self) return;

    const args = message.split(" ");
    if (
      args.length === 4 &&
      args[1].toLowerCase() === "set" &&
      userstate.username === "plasma_____"
    ) {
      const name = args[2];
      const tag = args[3];

      setAccountForChannel(channel, name, tag);

      client.say(channel, `Mapping set for ${channel}: ${name} - ${tag}`);
    } else {
      const doesExist = defaultMappings[channel];

      if (args.length < 3 && !doesExist) {
        client.say(channel, "Usage: !rune name tag");
        return;
      }

      let name: string;
      let tag: string;

      if (doesExist) {
        name = defaultMappings[channel].name;
        tag = defaultMappings[channel].tag;
      } else {
        name = args[1];
        tag = args[2];
      }

      console.log(name);
      console.log(tag);

      try {
        const res = await fetch(
          `http://localhost:8080/api/lol/runes/${name}/${tag}`
        );

        if (!res.ok) {
          client.say(
            channel,
            "An error occurred while fetching the data. res is not ok"
          );
          return;
        }
        const data = (await res.json()) as Array<string>;
        client.say(channel, data.join());
      } catch (error) {
        client.say(channel, "An error occurred while fetching the data.");
      }
    }
  },
};

export default runeCommand;
