import { CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
@Index(['follower', 'following'], { unique: true })
export class Follow {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.followings, { onDelete: 'CASCADE' })
    follower: User;

    @ManyToOne(() => User, user => user.followers , { onDelete: 'CASCADE' })
    following: User;    

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
