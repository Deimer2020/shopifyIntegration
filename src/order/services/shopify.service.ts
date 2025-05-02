import crypto from "crypto";
import axios from "axios";
import dotenv, { config } from "dotenv";
import fs from "fs/promises";
import path from "node:path";
import { ShopifyConfig } from "../types/shopifyConfig.data";

dotenv.config();
const directory = process.cwd();

export class ShopyfyService {
  private async readConfig(): Promise<ShopifyConfig[]> {
    const data = await fs.readFile(
      path.join(directory, "src/static/shopify_config.json"),
      {
        encoding: "utf8",
      }
    );
    return JSON.parse(data);
  }
  // Método para obtener la configuración de una empresa específica
  public async getConfigByEmpresa(shop: string) {
    const dataConfig = await this.readConfig();
    const config = dataConfig.find((c) => c.SHOPIFY_SHOP_NAME === shop);
    if (!config) {
      throw new Error(`No se encontró configuración para la empresa: ${shop}`);
    }
    return config;
  }

  public async getEventosByEmpresa(shop: string): Promise<string[]> {
    const config = await this.getConfigByEmpresa(shop);
    if (!config || !config.eventos) {
      throw new Error(
        `no se encontraron eventos configurados para el shop ${shop}`
      );
    }
    return config.eventos;
  }

  // CRUD: Obtener productos
  public async getProducts(empresa: string) {
    const config = await this.getConfigByEmpresa(empresa);
    const version = process.env.SHOPIFY_VERSION_API;
    const API_URL_VARIANTS = `https://${config.SHOPIFY_SHOP_NAME}/admin/api/${version}/products.json`;

    try {
      const response = await axios.get(API_URL_VARIANTS, {
        headers: {
          "X-Shopify-Access-Token": config.SHOPIFY_TOKEN,
        },
      });

      const listProductsGnal = response.data.variants ?? response.data.products;
      return listProductsGnal;
    } catch (error: any) {
      console.error(`Error obteniendo productos (${empresa}):, error.message`);
      return null;
    }
  }

  public async generateHmac(body: any, empresa: string): Promise<string> {
    try {
      const config = await this.getConfigByEmpresa(empresa);
      const secret = config.SHOPIFY_SECRET_KEY || "";
      if (!secret) {
        throw new Error(
          "La clave secreta SHOPIFY_SECRET_KEY no está configurada."
        );
      }

      // Convierte el cuerpo a JSON string
      const bodyString = JSON.stringify(body);

      // Genera la firma HMAC
      const hash = crypto
        .createHmac("sha256", secret)
        .update(bodyString)
        .digest("base64");

      console.log("Firma generada (HMAC):", hash); // Log para depuración
      return hash;
    } catch (error: any) {
      console.error("Error generando la firma HMAC:", error.message);
      throw new Error("No se pudo generar la firma HMAC.");
    }
  }
  public async webhook(bodyweb: any, header: string, empresa: string) {
    try {
      //  console.log("UPDATE_ORDER");
      const hmac = header;
      const hash = await this.generateHmac(bodyweb, empresa);
      if (hmac.trim() === hash.trim()) {
        console.log("Firma válida. Evento recibido:", bodyweb);
        return { valid: true, data: bodyweb };
      } else {
        console.log("Firma inválida. Petición rechazada.");
        return { valid: false, error: "Firma inválida" };
      }
    } catch (error: any) {
      console.error("Error al manejar el webhook:", error.message);
      return { valid: false, error: "Error interno del servidor" };
    }
  }
}
