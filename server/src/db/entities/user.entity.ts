import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Event } from "./event.entity";
import { EventParticipant } from "./event-participant.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  passwordHash!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @OneToMany(() => Event, (event) => event.owner)
  events!: Event[];

  @ManyToMany(() => Event, (event) => event.favoriteBy)
  @JoinTable({ name: "user_favorite_events" })
  favoriteEvents!: Event[];

  @OneToMany(() => EventParticipant, (participant) => participant.user)
  eventParticipants!: EventParticipant[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
