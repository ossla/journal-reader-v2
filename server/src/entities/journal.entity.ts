import { Entity,
        Column,
        PrimaryGeneratedColumn,
        OneToMany,
        JoinColumn,
        CreateDateColumn,
        UpdateDateColumn,
        OneToOne, 
        ManyToMany,
        JoinTable
    } from "typeorm"
import { Chapter } from "./chapter.entity"
import { Author } from "./author.entity"
import { Genre } from "./genre.entity"


@Entity()
export class Journal {
    @PrimaryGeneratedColumn()
    id: string

    @Column({type: "varchar", length: 40})
    title: string

    @Column({type: "int"})
    year: number

    @Column({type: "text"})
    description: string

    @Column({type: "varchar", length: 40})
    status: string

    @Column({type: "int", default: 0})
    number_of_chapters: number 

    @ManyToMany(() => Genre)
    @JoinTable()
    genres: Genre[]

    @ManyToMany(() => Author)
    @JoinTable()
    authors: Author[];

    @OneToMany(() => Chapter, (chapter) => chapter.journal, {onDelete: "CASCADE"})
    chapters: Chapter[];

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}