import type IEvent from "../interfaces/IEvent";
import camelCaseToTitleCase from "../utils/camelCaseToTitleCase";

const trioCommand: IEvent = {
    name: "trio",
    execute: async (client, commands, channel, userstate, message, self) => {
        if (self) return;

        const args = message.split(" ");

        if (args.length < 2) {
            client.say(channel, "Usage: !trio <champion>");
            return;
        }

        const champion = args[1];

        const res = await fetch(`https://tft.api.nanologic.dev/api/tft/items/trio/${champion}`);

        if (!res.ok) {
            client.say(channel, "An error occurred while fetching the data.");
            return;
        }
        
        const data = (await res.json()) as Array<string>;
        // Transform each string in the array from camel case to title case
        const transformedData = data.map(item => camelCaseToTitleCase(item));
        // Create the message by joining the first three for 'Best' and the rest for 'Optional'
        const formattedMessage = `Items: ${transformedData}`;
        client.say(channel, formattedMessage);
    }
};

export default trioCommand;