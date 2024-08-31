import { CommentType } from "src/enum/comment-typ.enum";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostEntity } from "./post.entity";
import { User } from "./user.entity";

@Entity()
export class CommentEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    content: string

    @Column({ type: 'enum', enum: CommentType,default: CommentType.Comment })
    type: CommentType

    @Column({ nullable: true })
    parentCommendId: number

    @Column({ nullable: true })
    parentCommentAuthor: string

    @ManyToOne(() => CommentEntity, comment => comment.childComments)
    @JoinColumn({ name: 'parentCommendId' })
    parentComment: CommentEntity;

    @OneToMany(() => CommentEntity, comment => comment.parentComment)
    childComments: CommentEntity[]

    @ManyToOne(() => PostEntity, (post) => post.comments, { eager: false })
    @JoinColumn([{ name: 'postId', referencedColumnName: 'id' }])
    post: PostEntity

    @ManyToOne(() => User, (user) => user.posts, { eager: false })
    @JoinColumn([{ name: 'userEmail', referencedColumnName: 'email' }])
    user: User

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    childrenCount: number;
}