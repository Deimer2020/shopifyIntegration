import { CityService } from "../modules/products/services/city.service";
import { AriFactureBody } from "../types/AriFacture.data";
import { LineItem, ShopifyResponse } from "../types/shopify.data";

export const mapShopifyToInvoiceData = async (
  shopifyData: ShopifyResponse,
  tokenAri: string
): Promise<AriFactureBody | null> => {
  const city = await CityService.obtainCity(
    shopifyData.billing_address.city,
    shopifyData.billing_address.province
  );
  if (city === null) {
    return null;
  }
  return {
    Cliente: {
      NumeroDocumento: shopifyData.customer.id.toString(),
      PrimerApellido: shopifyData.billing_address.last_name,
      SegundoApellido: "",
      PrimerNombre: shopifyData.billing_address.first_name,
      SegundoNombre: "",
      Telefono: shopifyData.billing_address.phone || "",
      CodigoDaneCiudad: city.codigo,
      TipoRegimen: 0,
      Direccion: shopifyData.billing_address.address1,
      Email: shopifyData.email,
      TipoDocumento:
        !shopifyData.company || shopifyData.company === "" ? 13 : 31,
      Naturaleza: !shopifyData.company || shopifyData.company === "" ? 0 : 1,
      RegimenFiscalCodigo: "49",
      ResponsabilidadesFiscalesCodigo: "R-99-PN",
      TributosCodigo: "ZZ",
    },
    NumeroOrdenPedido: shopifyData.order_number.toString(),
    FormasPago: [
      {
        Codigo: 1,
        Valor: parseFloat(shopifyData.total_price),
        NumeroComprobante: shopifyData.confirmation_number.toString(),
        TipoTarjetas: 0,
        CodigoFranquiciaTarjetas: 1,
        CodigoCuentaBancaria: "",
      },
    ],
    Producto: [
      ...shopifyData.line_items.map((item: LineItem) => ({
        Referencia: item.id,
        CodigoBarras: item.CodigoBarras || "000000000000",
        Cantidad: item.quantity,
        PrecioVentaConIva: parseFloat(item.price),
        PorcentajeIva: shopifyData.tax_lines[0]?.rate * 100 || 0,
        IdIva: 0,
        ValorBase: parseFloat(item.price),
        PorcentajeDescuento: 0,
        TotalDescuento: Number(item.total_discount),
        ValorTotal: parseFloat(item.price) * item.quantity,
        Combo: 0,
        CostoUnitario: 0,
      })),
    ],
    NumeroDocumentoEmpleado: "9999999",
    TipoNumeracion: 0,
    Token: tokenAri,
  };
};
