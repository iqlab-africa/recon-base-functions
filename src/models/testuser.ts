import { Table, Column, Model, HasMany, DataType, AutoIncrement } from "sequelize-typescript";
import { DevBook } from "./book";
import { sequelize } from ".";

@Table
export class DevUser extends Model {
  @Column({ allowNull: false })
  name: string;

  @AutoIncrement
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    comment: "The famous user identifier",
  })
  userId: number;

  @Column({ allowNull: false })
  date: string;

  @HasMany(() => DevBook, { foreignKey: 'userId' })
  books: DevBook[];
}

