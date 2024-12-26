import type IEvent from "../interfaces/IEvent";
import camelCaseToTitleCase from "../utils/camelCaseToTitleCase";

const deltaCommand: IEvent = {
    name: "delta",
    execute: async (client, commands, channel, userstate, message, self) => {
        if (self) return;

        const args = message.split(" ");

        if (args.length < 2) {
            client.say(channel, "Usage: !delta <champion>");
            return;
        }

        const champion = args[1];

        const res = await fetch(`https://tft.api.nanologic.dev/api/tft/items/delta/${champion}`);

        if (!res.ok) {
            client.say(channel, "An error occurred while fetching the data.");
            return;
        }
        
        const data = (await res.json()) as Array<string>;
        const transformedData = data.map(item => camelCaseToTitleCase(item));
        const formattedMessage = `Items: ${transformedData}`;

        client.say(channel, formattedMessage);
    }
};

export default deltaCommand;