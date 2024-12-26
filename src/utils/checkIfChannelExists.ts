import fetch from "node-fetch";
import * as dotenv from "dotenv";

dotenv.config();

const clientId = process.env.TWITCH_BOT_ID as string;
const clientSecret = process.env.TWITCH_BOT_SECRET as string;

async function checkChannelExists(channelName: string): Promise<boolean> {
  if (!channelName) {
    return false;
  }

  const accessToken = process.env.TWITCH_BOT_TOKEN;

  const headers = {
    "Client-ID": clientId,
    Authorization: `Bearer ${accessToken}`,
  };

  const searchUrl = `https://api.twitch.tv/helix/search/channels?query=${channelName}`;

  try {
    const response = await fetch(searchUrl, { headers });
    const data = await response.json();

    if (!data || !data.data) {
      console.error("Unexpected response structure:", data);
      return false;
    }

    const channels = data.data;

    for (const channel of channels) {
      if (channel.display_name.toLowerCase() === channelName.toLowerCase()) {
        return true;
      }
    }
  } catch (error) {
    console.error("Error fetching channel data:", error);
  }

  return false;
}

export default checkChannelExists;
