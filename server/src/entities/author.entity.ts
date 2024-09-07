import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm"
import { Journal } from "./journal.entity"

@Entity()
export class Author {
    @PrimaryGeneratedColumn()
    id: string

    @Column({type: "varchar", length: 40})
    name: string
}
