import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { CommentEntity } from "./comment.entity";
import { PostStatus } from "src/enum/post-status.enum";

@Entity()
export class PostEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    description: string

    @Column()
    status: PostStatus

    @ManyToOne(() => User, (user) => user.posts, { eager: false })
    @JoinColumn([{ name: 'userEmail', referencedColumnName: 'email' }])
    user: User
    
    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date

    @Column('text', { array: true, nullable: false })
    imageUrls: string[]

    @Column('text', { array: true, nullable: false })
    likes: string[]

    @Column('text', { array: true, nullable: false })
    bookMarkedUsers: string[];

    @OneToMany(() => CommentEntity, comment => comment.post, { eager: true })
    @JoinColumn([{ name: 'commentId', referencedColumnName: 'id' }])
    comments: CommentEntity[]

    commentCount: number
}