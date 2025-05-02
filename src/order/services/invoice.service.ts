import { ShopifyConfig } from "../types/shopifyConfig.data";
import { ShopyfyService } from "./shopify.service";
import { ResponseAri } from "../types/responseAriFacture";
import { ShopifyResponse } from "../types/shopify.data";
import { mapShopifyToInvoiceData } from "../utils/mapShopifyToInvoiceData";
import { AuditService } from "./audit.service";
import { AriFactureBody } from "../types/AriFacture.data";

// 👇 Función de validación
function handleAriResponse(response: Response, responseAri: ResponseAri) {
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status} - ${response.statusText}`);
  }

  if (!responseAri.Exito) {
    const mensajeError =
      responseAri.MensajeError || "Fallo al generar la factura en ARI.";
    throw new Error(`Error en ARI: ${mensajeError}`);
  }

  return responseAri;
}

export class InvoiceService {
  static async sendInvoiceToExternalService(
    data: ShopifyResponse,
    shop: string
  ): Promise<{ success: boolean; data: any; error?: any }> {
    try {
      const auditService = new AuditService();
      const order = await auditService.existOrder(data.order_number.toString());
      if (order) {
        return {
          success: false,
          data: null,
          error: "Ya se encuentra facturada esta orden",
        };
      }
      const token = await obtenerToken(shop);
      const invoiceData = await mapShopifyToInvoiceData(data, token);

      const response = await fetch(
        `${process.env.ARI_SERVICE_URL}/GuardarFacturaVenta`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoiceData),
        }
      );
      const responseAri = (await response.json()) as ResponseAri;

      handleAriResponse(response, responseAri);

      if (!response.ok) {
        throw new Error(`Error al enviar la factura: ${response.statusText}`);
      }
      const responseLog = await auditService.create(
        responseAri,
        invoiceData as AriFactureBody
      );
      if (!responseLog) {
        console.log("Ya se facturo el producto");
      }

      return { success: responseAri.Exito, data: responseAri };
    } catch (error: any) {
      console.error("Error enviando datos al servicio externo:", error.message);
      return { success: false, data: null, error };
    }
  }
}

export async function obtenerToken(shop: string): Promise<string> {
  try {
    const shopifyService: ShopyfyService = new ShopyfyService();
    const company = await shopifyService.getConfigByEmpresa(shop);
    if (!company) {
      throw new Error("Empresa no configurada");
    }
    const response = await fetch(
      `${process.env.ARI_SERVICE_URL}/login/authenticate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IdDocumento: "0",
          Cadena: [company.cadena],
          HabilitarContabilidad: company.account,
          IdUsuario: 1,
          Usuario: "PAGINA",
          Contrasena: "PAGINA",
          Servicio: 0,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error obteniendo token: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error al obtener el token:", error.message);
    throw new Error("No se pudo obtener el token de autenticación.");
  }
}
