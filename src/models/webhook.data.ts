import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
} from "sequelize-typescript";

@Table
export class WebHook extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    comment: "The famous identifier",
  })
  webhookId: number;

  @Column
  robotName: string;

  @Column
  robotDate: string;

  @Column
  emoji: string;

  @Column
  date: Date;

  @Column
  numberProcessed: number;
}
