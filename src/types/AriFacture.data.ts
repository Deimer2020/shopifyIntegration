export interface AriFactureBody {
  Cliente: Cliente;
  NumeroOrdenPedido: string;
  FormasPago: FormasPago[];
  Producto: Producto[];
  NumeroDocumentoEmpleado: string;
  TipoNumeracion: number;
  Token: string;
}

export interface Cliente {
  NumeroDocumento: string;
  PrimerApellido: string;
  SegundoApellido: string;
  PrimerNombre: string;
  SegundoNombre: string;
  Telefono: string;
  CodigoDaneCiudad: string;
  TipoRegimen: number;
  Direccion: string;
  Email: string;
  TipoDocumento: number;
  Naturaleza: number;
  RegimenFiscalCodigo: string;
  ResponsabilidadesFiscalesCodigo: string;
  TributosCodigo: string;
}

export interface FormasPago {
  Codigo: number;
  Valor: number;
  NumeroComprobante: string;
  TipoTarjetas: number;
  CodigoFranquiciaTarjetas: number;
  CodigoCuentaBancaria: string;
}

export interface Producto {
  Referencia: number;
  CodigoBarras: string;
  Cantidad: number;
  PrecioVentaConIva: number;
  PorcentajeIva: number;
  IdIva: number;
  ValorBase: number;
  PorcentajeDescuento: number;
  TotalDescuento: number;
  ValorTotal: number;
  Combo: number;
  CostoUnitario: number;
}
