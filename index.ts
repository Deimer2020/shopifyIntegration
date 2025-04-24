import express, { Request, Response } from "express";
import { URL_PRODUCTS } from "./src/utils/constanst";
import { URL_WEBHOOK } from "./src/utils/constanst";
import { ProductRouter } from "./src/modules/products/router/product.router";
import { WebhookRouter } from "./src/modules/products/router/webHook.router";
import bodyParser from "body-parser";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send(`LEYENDO VARIABLES`);
});

/* app.post("/facturar", (req: Request, res: Response) => {
  console.log("Datos recibidos para facturación:", req.body);

  // Simular respuesta exitosa
  res.status(200).json({
    message: "Factura procesada correctamente",
    data: req.body
  });
});
 */



//manejo de rutas
app.use(URL_PRODUCTS, new ProductRouter().router);//para productos

app.use(URL_WEBHOOK, new WebhookRouter().router);//para el webhook
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
