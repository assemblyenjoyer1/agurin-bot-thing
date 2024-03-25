import { Client } from 'tmi.js';
import type ICommand from './ICommand';

export default interface IEvent {
	name: string;
	execute(client: Client, commands: Map<string, ICommand>, ...args: any[]): void;
}