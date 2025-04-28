import { ShopyfyService } from "../../../shopify/shopify.service";
import { ResponseAri } from "../../../types/responseAriFacture";
import { ShopifyResponse } from "../../../types/shopify.data";
import { mapShopifyToInvoiceData } from "../../../utils/mapShopifyToInvoiceData";

export class InvoiceService {
  static async sendInvoiceToExternalService(
    data: ShopifyResponse,
    shop: string
  ): Promise<{ success: boolean; data: any; error?: any }> {
    try {
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
      console.log("RESPONSE ARI==>", JSON.stringify(responseAri));

      if (!response.ok) {
        throw new Error(`Error al enviar la factura: ${response.statusText}`);
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
    const company = ShopyfyService.getConfigByEmpresa(shop);
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
