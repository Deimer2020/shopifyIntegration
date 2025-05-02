import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
} from "sequelize-typescript";

@Table({
  tableName: "audit_billing",
  timestamps: false,
})
export class AuditBilling extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  numero_orden!: string;

  @Column({
    type: DataType.STRING,
  })
  numero_factura!: string;

  @Column({
    type: DataType.STRING,
  })
  cliente!: string;

  @Column({
    type: DataType.STRING,
  })
  details!: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  fecha_creacion!: Date;
}
