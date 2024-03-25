import type IEvent from "../interfaces/IEvent";
import camelCaseToTitleCase from "../utils/camelCaseToTitleCase";

const itemsCommand: IEvent = {
    name: "items",
    execute: async (client, commands, channel, userstate, message, self) => {
        if (self) return;

        const args = message.split(" ");

        if (args.length < 2) {
            client.say(channel, "Usage: !items <champion>");
            return;
        }

        const champion = args[1];

        const res = await fetch(`https://tft.api.nanologic.dev/api/tft/items//api/tft/items/${champion}`);

        if (!res.ok) {
            client.say(channel, "An error occurred while fetching the data.");
            return;
        }
        
        const data = (await res.json()) as Array<string>;
        // Transform each string in the array from camel case to title case
        const transformedData = data.map(item => camelCaseToTitleCase(item));
        // Create the message by joining the first three for 'Best' and the rest for 'Optional'
        const formattedMessage = `Best: ${transformedData.slice(0, 3).join(", ")} | Optional: ${transformedData.slice(3).join(", ")}`;
        client.say(channel, formattedMessage);
    }
};

export default itemsCommand;