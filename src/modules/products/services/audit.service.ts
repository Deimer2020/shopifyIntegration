import { AriFactureBody } from "../../../types/AriFacture.data";
import { ResponseAri } from "../../../types/responseAriFacture";
import { AuditBilling } from "../model/logTable.model";

export class AuditService {
  async create(data: ResponseAri, dataToAri: AriFactureBody): Promise<boolean> {
    const exist = await this.existOrder(dataToAri.NumeroOrdenPedido);
    if (exist) {
      return false;
    }
    const newAudit = await AuditBilling.create({
      numero_orden: dataToAri.NumeroOrdenPedido,
      numero_factura: data.NumeroFactura,
      cliente: JSON.stringify(dataToAri.Cliente),
      details: JSON.stringify(dataToAri),
    });
    if (newAudit) {
      console.log("LOG CREADO");
      return true;
    }
    console.log("ERROR AL CREAR LOG");
    return false;
  }

  get(numero_orden: string): Promise<AuditBilling | null> {
    const order = AuditBilling.findOne({ where: { numero_orden } });
    return order;
  }

  async existOrder(numero_orden: string) {
    const existOrderFacture = await this.get(numero_orden);
    if (existOrderFacture === null) {
      console.log("Ya esta facturado");
      return true;
    }
    if (existOrderFacture && existOrderFacture.numero_factura) {
      console.log("Ya esta facturado");
      return true;
    }
    return false;
  }
}
