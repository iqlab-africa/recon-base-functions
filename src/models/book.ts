import { Table, Column, Model, DataType, AutoIncrement, BelongsTo, ForeignKey } from "sequelize-typescript";
import { DevUser } from "./testuser";
import { sequelize } from ".";

@Table
export class DevBook extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    comment: "The famous book identifier",
  })
  bookId: number;

  @Column
  title: string;

  @Column
  description: string;

  @Column
  name: string;

  @Column
  date: Date;

  @ForeignKey(() => DevUser)
  @Column
  userId: number;

  @BelongsTo(() => DevUser)
  user: DevUser;
}


