import { Request, Response } from "express";
import { ShopyfyService } from "../../../shopify/shopify.service";
import { InvoiceService } from "../../../invoice/invoice.service";
import { mapShopifyToInvoiceData } from "../../../utils/mapShopifyToInvoiceData";

export class WebhookController {
 

  async webhook(req: Request, res: Response) {
    try {
      console.log("Encabezados recibidos:", req.headers);
      const body = req.body;
      console.log("Cuerpo recibido:", body);
    
      // Obtener encabezados
      const hmac = req.headers["x-shopify-hmac-sha256"] as string;
      const topic = req.headers["x-shopify-topic"] as string;
      const shopDomain = req.headers["x-shopify-shop-domain"] as string;

      if (!shopDomain) {
        console.warn("Falta el encabezado de X-Shopify-Shop-Domain ");
        return res
          .status(400)
          .json({ error: "Falta el encabezado 'X-Shopify-Shop-Domain'." });
      }

      if (!hmac || !topic || !shopDomain) {
        console.error("Encabezados faltantes.");
        return res
          .status(400)
          .json({ error: "Faltan encabezados requeridos." });
      }
      console.log("SHOP RECIBIDOS--->", shopDomain);

      // Validar y obtener eventos para la tienda
      let eventos: string[] = [];
      try {
        eventos = ShopyfyService.getEventosByEmpresa(shopDomain);
        console.log("Eventos obtenidos:", eventos);
      } catch (error: any) {
        console.error(
          `Error obteniendo eventos para el shop ${shopDomain}:`,
          error.message
        );
        return res.status(404).json({
          error: `La tienda '${shopDomain}' no está registrada en el sistema.`,
        });
      }

      // Validar eventos permitidos
      if (!eventos.includes(topic)) {
        console.warn(
          `Evento ${topic} no permitido para la empresa ${shopDomain}.`
        );
        return res.status(403).json({ error: `Evento ${topic} no permitido.` });
      }

      // Generar y validar firma HMAC
      const signature = ShopyfyService.generateHmac(body, shopDomain);
      console.log(`Firma HMAC generada: ${signature}`);

      if (hmac.trim() !== signature.trim()) {
        console.warn("Firma HMAC inválida.");
        return res.status(403).json({ error: "Firma HMAC inválida." });
      }

      console.log(`Evento recibido: ${topic}`);
      if (topic === "orders/paid") {
        console.log("Factura pagada, procesando evento...");
    
        try {
          //const body = req.body;

          // Mapea los datos del webhook al formato de facturación
          const invoiceData = await mapShopifyToInvoiceData(body);

          // Envía los datos al servicio de facturación externo
          await InvoiceService.sendInvoiceToExternalService(invoiceData);

          res.status(200).json({ message: "Factura enviada exitosamente" });
      } catch (error: any) {
          console.error("Error procesando el webhook:", error.message);
          res.status(500).json({ error: "Error interno del servidor" });
      }
         
      
      
      }

      // Procesar el webhook
      const result = ShopyfyService.webhook(body, hmac, shopDomain);

      if (!result.valid || result.error) {
        console.error("Error procesando el webhook:", result.error);
        return res.status(403).json({
          error: result.error || "Hubo un error al procesar el webhook.",
        });
      }

      console.log("Webhook procesado correctamente.");
      res.status(200).json({
        message: "Webhook procesado correctamente.",
        data: result,
      });
    } catch (error: any) {
      console.error("Error manejando el webhook:", error.message);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
}
