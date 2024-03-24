import * as express from 'express';
import * as bodyParser from 'body-parser';
import axios from 'axios';

export default class ExpressProvider {
	private _app: express.Application;
	private _port: number = 3000;
	private _clientID: string = 'ID';
	private _clientSecret: string = 'SECRET';
	private _appAccessToken: string | undefined;
	private _tokenExpiresIn: number | undefined;
	private _tokenAcquiredAt: number | undefined;

	constructor() {
		this._app = express.application;
	}

	async init() {
		console.log("[ExpressProvider] Init..");

		this._app.listen(this._port, () => {
			console.log(`App listening on port ${this._port}`);
		});

		this.registerMiddlewares();
		this.registerRoutes();
		await this.obtainAppAccessToken(); // Get initial App Access Token
	}

	async obtainAppAccessToken(): Promise<void> {
		try {
			const response = await axios.post(`https://id.twitch.tv/oauth2/token`, null, {
				params: {
					client_id: this._clientID,
					client_secret: this._clientSecret,
					grant_type: 'client_credentials'
				}
			});

			this._appAccessToken = response.data.access_token;
			this._tokenExpiresIn = response.data.expires_in;
			this._tokenAcquiredAt = Date.now();
			console.log("[ExpressProvider] App Access Token obtained");
		} catch (error) {
			console.error("[ExpressProvider] Error obtaining App Access Token:", error);
		}
	}

	// Function to get the current App Access Token
	async getAppAccessToken(): Promise<string> {
		/*if (!this._appAccessToken || Date.now() >= this._tokenAcquiredAt! + (this._tokenExpiresIn! - 300) * 1000) {
			// Refresh the token 5 minutes before it expires
			await this.obtainAppAccessToken();
		}*/
		return this._appAccessToken!;
	}

	private registerMiddlewares() {
		console.log("[ExpressProvider] Registering middlewares..");
		this._app.use(bodyParser.json());
	}

	private registerRoutes() {
		console.log("[ExpressProvider] Registering routes..");
		// You can add routes here if needed
	}
}
