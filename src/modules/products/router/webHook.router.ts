import express, { Request, Response } from "express";
import { WebhookController } from "../controller/webHook.controller";

export class WebhookRouter {
  public router: express.Router;
  private webhookController: WebhookController;

  constructor() {
    this.router = express.Router();
    this.webhookController = new WebhookController();
    this.routes();
  }

  private routes() {
    this.router.post("/", (req: Request, res: Response) =>
      this.webhookController.webhook(req, res)
    );
  }
}
