import type { Client } from "tmi.js";

export default interface ICommand {
	name: string;
	execute(client: Client, commands: Map<string, ICommand>, ...args: any[]): void;
}