import { Entity,
        Column,
        PrimaryGeneratedColumn,
        ManyToOne,
        JoinColumn,
        CreateDateColumn
    } from "typeorm"
import { Journal } from "./journal.entity"

@Entity()
export class Chapter {
    @PrimaryGeneratedColumn()
    id: string

    @Column({type: "varchar", length: 50})
    name: string

    @Column({type: "int"})
    size: number

    @Column({type: "int"})
    serial_number: number

    @ManyToOne(() => Journal, (journal) => journal.chapters, {onDelete: "CASCADE"})
    @JoinColumn()
    journal: Journal

    @CreateDateColumn()
    createdAt: Date
}