import { config } from "dotenv";
import express, { Request, Response } from "express";
import { URL_PRODUCTS } from "./src/order/utils/constanst";
import { URL_WEBHOOK } from "./src/order/utils/constanst";
import { ProductRouter } from "./src/order/router/product.router";
import { WebhookRouter } from "./src/order/router/webHook.router";
import { DbConnecction } from "./src/db/connection";

const PORT = process.env.PORT || 3000;

class AppShopify {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.initDb();
    this.routes();
    this.listen();
  }

  async initDb() {
    const connect = new DbConnecction();
    connect.connectDb();
  }

  routes() {
    this.app.use(URL_PRODUCTS, new ProductRouter().router); //para productos
    this.app.use(URL_WEBHOOK, new WebhookRouter().router); //para el webhook
    // this.app.use((req, res, next) => {
    //   console.log(`Solicitud recibida: ${req.method} ${req.url}`);
    //   next();
    // });
  }

  listen() {
    this.app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  }
}

new AppShopify();
