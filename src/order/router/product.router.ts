import express, { Request, Response } from "express";
import { ProductController } from "../controller/product.controller";

export class ProductRouter {
  public router: express.Router;

  constructor(
    private productController: ProductController = new ProductController()
  ) {
    this.router = express.Router();
    this.routes();
  }

  routes() {
    this.router.get("", async (req: Request, res: Response) =>
      this.productController.getAll(req, res)
    );

 /*    
    this.router.post("/webhook", async (req: Request, res: Response) =>
      this.productController.webhook(req, res)
    ); */
  }
}
