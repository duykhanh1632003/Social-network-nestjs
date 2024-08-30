import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatRoomEntity } from "./chatroom.entity";
import { User } from "./user.entity";
import { MessageType } from "src/enum/message-type";

@Entity()
export class MessageEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    content: string

    @ManyToOne(() => ChatRoomEntity, (chatroom) => chatroom.messages)
    chatRoom: ChatRoomEntity;

    @ManyToOne(() => User, (user) => user.messages)
    sender: User;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column()
    type: MessageType;
}