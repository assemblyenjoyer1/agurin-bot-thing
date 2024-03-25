import * as express from 'express';
import bodyParser from 'body-parser';

export default class ExpressProvider {
	private _app: express.Application;
	private _port: number = 3000;

	constructor() {
		this._app = express.default();
	}

	async init() {
		console.log("[ExpressProvider] Init..");

		this._app.listen(this._port, () => {
			console.log(`App listening on port ${this._port}`);
		});

		this.registerMiddlewares();
		this.registerRoutes();
	}

	private registerMiddlewares() {
		console.log("[ExpressProvider] Registering middlewares..");

		this._app.use(bodyParser.json());
		this._app.use(bodyParser.urlencoded({ extended: true }));
	}

	private registerRoutes() {
		console.log("[ExpressProvider] Registering routes..");

		this._app.get('/', (req, res) => {
			res.send("ok");
		});
	}
}
