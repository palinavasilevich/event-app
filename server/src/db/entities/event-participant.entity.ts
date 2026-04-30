import { Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";
import { User } from "./user.entity";

@Entity("event_participants")
@Index("UQ_EVENT_PARTICIPANTS_EVENT_USER", ["eventId", "userId"], {
  unique: true,
})
export class EventParticipant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;
}
