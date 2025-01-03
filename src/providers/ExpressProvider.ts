import * as express from "express";
import bodyParser from "body-parser";
import type TwitchProvider from "./TwitchProvider";
import checkIfChannelExists from "../utils/checkIfChannelExists";

export default class ExpressProvider {
  private _app: express.Application;
  private _port: number = 4000;
  private _twitchProvider?: TwitchProvider;

  constructor() {
    this._app = express.default();
  }

  async init(twitchProvider: TwitchProvider) {
    console.log("[ExpressProvider] Init..");

    this._twitchProvider = twitchProvider;

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

    this._app.get("/", (req, res) => {
      res.send("ok");
    });

    this._app.post("/join", async (req, res) => {
      const { channel } = req.body;
      const exists = await checkIfChannelExists(channel);
      if (!exists) {
        res.send(
          `Failed to join. Channel not found / doesn't exist: ${channel}`
        );
        return;
      }
      console.log(`[ExpressProvider] Joining channel: ${channel}`);
      this._twitchProvider?.joinChannel(channel);
      res.send(`Joining channel: ${channel}`);
    });
  }
}
