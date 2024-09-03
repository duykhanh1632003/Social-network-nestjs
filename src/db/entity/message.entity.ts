import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ChatRoomEntity } from "./chatroom.entity";
import { User } from "./user.entity";
import { MessageType } from "src/enum/message-type";

@Entity()
export class MessageEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(() => ChatRoomEntity, (chatroom) => chatroom.messages)
    chatRoom: ChatRoomEntity;

    @ManyToOne(() => User, (user) => user.messages)
    sender: User;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column()
    type: MessageType;
}
