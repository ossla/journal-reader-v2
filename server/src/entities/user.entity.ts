import { Entity,
        Column,
        PrimaryGeneratedColumn,
        OneToOne
    } from "typeorm"
import { Favorite } from "./favorites.entity"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: string

    @Column({type: "bool", default: false})
    is_admin: boolean

    @Column({type: "varchar", length: 40})
    username: string

    @Column({type: "varchar", length: 40})
    email: string

    @Column({type: "varchar", length: 200})
    password: string

    @Column({type: "varchar", length: 200, default: "default"})
    photo: string

    @OneToOne(() => Favorite, (favorite) => favorite.user
                , {onDelete: "CASCADE"})
    favorites: Favorite
}