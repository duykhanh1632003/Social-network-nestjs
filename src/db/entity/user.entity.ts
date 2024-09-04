import { BaseEntity, Column, Entity, JoinColumn, OneToMany, Unique } from "typeorm";
import { PostEntity } from "./post.entity";
import { Follow } from "./follow.entity";
import { MessageEntity } from "./message.entity";
import { UserChatRoomEntity } from "./user-chatroom.entity";

@Entity()
@Unique(['email'])
export class User extends BaseEntity {

    @Column({ primary: true })
    email: string;

    @Column()
    uuid: string;

    @Column()
    socialType: string;

    @Column()
    username: string;

    @Column()  // Thêm cột mật khẩu
    password: string;

    @OneToMany(() => PostEntity, post => post.user, { eager: true })
    @JoinColumn([{ name: 'postId', referencedColumnName: 'id' }])
    posts: PostEntity[];

    @Column()
    createdAt: Date;

    @Column({ default: 'https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg' })
    thumbnail: string;

    @Column('int', { array: true, nullable: false })
    bookMarks: number[];

    @Column({ default: "" })
    statusMessage: string;

    @OneToMany(() => UserChatRoomEntity, chatRoom => chatRoom.user)
    @JoinColumn([{ name: 'chatRoomId', referencedColumnName: 'id' }])
    userChatRooms: UserChatRoomEntity[];    

    @OneToMany(() => MessageEntity, message => message.sender)
    messages: MessageEntity[];

    @OneToMany(() => Follow, follow => follow.follower)
    followings: Follow[];

    @OneToMany(() => Follow, follow => follow.following)
    followers: Follow[];

    totalPostCount: number;

    followerCount: number;

    followingCount: number;

}
