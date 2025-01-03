import { Client } from "tmi.js";
import fs from "node:fs";
import type ICommand from "../interfaces/ICommand";

export default class TwitchProvider {
  private _client?: Client;
  private _commands = new Map<string, ICommand>();

  constructor() {}

  init(callback: () => void) {
    console.log("[TwitchProvider] Init..");

    if (!fs.existsSync("./data")) {
      fs.mkdirSync("./data");
    }

    if (!fs.existsSync("./data/channels.json")) {
      fs.writeFileSync("./data/channels.json", "[]");
    }

    const channels = JSON.parse(
      fs.readFileSync("./data/channels.json", "utf-8")
    );

    this._client = new Client({
      options: { debug: true },
      identity: {
        username: process.env.TWITCH_BOT_ID,
        password: process.env.TWITCH_BOT_TOKEN,
      },
      channels: channels,
    });

    this._client.connect().catch((error) => {
      console.error("Connection error:", error);
    });

    this.registerEvents();
    this.registerCommands();

    callback();
  }

  private registerEvents() {
    console.log("[TwitchProvider] Registering events..");

    const eventFiles = fs
      .readdirSync("./src/events")
      .filter((file) => file.endsWith(".ts"));

    for (const file of eventFiles) {
      const event = require(`../events/${file}`).default;
      console.log(`[TwitchProvider] Registering event: ${event.name}`);
      this._client?.on(event.name, (...args: any[]) =>
        event.execute(this._client, this._commands, ...args)
      );
    }
  }

  private registerCommands() {
    console.log("[TwitchProvider] Registering commands..");

    const commandFiles = fs
      .readdirSync("./src/commands")
      .filter((file) => file.endsWith(".ts"));

    for (const file of commandFiles) {
      const command = require(`../commands/${file}`).default;
      console.log(`[TwitchProvider] Registering command: ${command.name}`);
      this._commands.set(command.name, command);
    }
  }

  public async joinChannel(channel: string) {
    console.log(`[TwitchProvider] Joining channel: ${channel}`);
    // Write the channel to the channels.json file, write it as an array
    const channels = JSON.parse(
      fs.readFileSync("./data/channels.json", "utf-8")
    );
    channels.push(channel);
    fs.writeFileSync("./data/channels.json", JSON.stringify(channels));
    this._client?.join(channel);
  }
}
