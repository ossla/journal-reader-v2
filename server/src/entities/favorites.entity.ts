import { Entity,
        PrimaryGeneratedColumn,
        JoinColumn,
        OneToOne,
        OneToMany,
        ManyToOne,
        ManyToMany,
        JoinTable
    } from "typeorm"
import { User } from "./user.entity"
import { Journal } from "./journal.entity"

@Entity()
export class Favorite {
    @PrimaryGeneratedColumn()
    id: string

    @OneToOne(() => User, (user) => user.favorites)
    @JoinColumn()
    user: User

    @ManyToMany(() => Journal)
    @JoinTable()
    journals: Journal[]
}