import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
} from "sequelize-typescript";

@Table
export class BestPlayer extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    comment: "The famous identifier",
  })
  bestPlayerId: number;

  @Column
  robotName: string;

  @Column
  robotDate: string;

  @Column
  bestPlayer: string;

  @Column
  date: Date;

}
