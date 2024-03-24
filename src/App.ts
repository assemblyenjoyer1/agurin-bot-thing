import ExpressProvider from "./providers/ExpressProvider";
import TwitchProvider from "./providers/TwitchProvider";

export default class App {
	private _expressProvider: ExpressProvider;
	private _twitchProvider: TwitchProvider;

	constructor() {
		this._expressProvider = new ExpressProvider();
		this._twitchProvider = new TwitchProvider();
	}

	init() {
		console.log("[App] Init..");

		this._expressProvider.init();
		this._expressProvider.getAppAccessToken().then(accessToken => {
			console.log(accessToken);
			this._twitchProvider.init(accessToken);
		});
	}
}