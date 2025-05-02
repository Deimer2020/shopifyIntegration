import crypto from "crypto";
import axios from "axios";
import dotenv, { config } from "dotenv";

dotenv.config();
const configShopify = [
  {
    SHOPIFY_TOKEN:"",
    SHOPIFY_API_KEY:  "",
    SHOPIFY_SECRET_KEY: "",
    SHOPIFY_SHOP_NAME:"",
    SHOPIFY_VERSION_API: "",
    cadena: "",
    account: 0,
    eventos: ["orders/paid"],
  },
];

export class ShopyfyService {
  // Método para obtener la configuración de una empresa específica
  public static getConfigByEmpresa(shop: string) {
    const config = configShopify.find((c) => c.SHOPIFY_SHOP_NAME === shop);
    if (!config) {
      throw new Error(`No se encontró configuración para la empresa: ${shop}`);
    }
    return config;
  }
  //metodo para obtener los eventos por empresa
  public static getEventosByEmpresa(shop: string): string[] {
    const config = this.getConfigByEmpresa(shop);
    if (!config || !config.eventos) {
      throw new Error(
        `no se encontraron eventos configurados para el shop ${shop}`
      );
    }
    return config.eventos; // Retorna los eventos configurados para la empresa
  }

  // CRUD: Obtener productos
  public static async getProducts(empresa: string) {
    const config = this.getConfigByEmpresa(empresa);
    const API_URL_VARIANTS = `https://${config.SHOPIFY_SHOP_NAME}/admin/api/${config.SHOPIFY_VERSION_API}/products.json`;

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

  //CRUD
  /*  public static async getProducts() {
    const API_URL_PRODUCTS = https://${this.SHOP_NAME}/admin/api/${this.VERSION_API}/products.json;
    const API_URL_VARIANTS = https://${this.SHOP_NAME}/admin/api/${this.VERSION_API}/variants.json;
    try {
      const response = await axios.get(API_URL_VARIANTS, {
        headers: {
          "X-Shopify-Access-Token": this.ACCESS_TOKEN,
        },
      });

      const listProductsGnal = response.data.variants ?? response.data.products;
      //   const product = ShopifyUtils.getByProductByKey(
      //     "325455454",
      //     "barcode",
      //     listProductsGnal
      //   );
      return listProductsGnal;
    } catch (error: any) {
      console.error("Error obteniendo productos:", error);
      return null;
    }
  }
 */

  //WEBHOOK

  // Nueva función para generar la firma HMAC
  public static generateHmac(body: any, empresa: string): string {
    try {
      const config = this.getConfigByEmpresa(empresa);
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
  public static webhook(bodyweb: any, header: string, empresa: string) {
    try {
      //  console.log("UPDATE_ORDER");
      const hmac = header;
      const hash = this.generateHmac(bodyweb, empresa);
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
