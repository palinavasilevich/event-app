import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id!: string;
}
