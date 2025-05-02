import { Request, Response } from "express";
import { ShopyfyService } from "../services/shopify.service";

export class ProductController {
  async getAll(req: Request, res: Response) {
    res.send(await ShopyfyService.getProducts("empresa1"));
  }

  save(req: Request, res: Response) {}

  update(req: Request, res: Response) {}
}
