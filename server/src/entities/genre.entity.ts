import { 
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToMany,
} from "typeorm"
import { Journal } from "./journal.entity"

@Entity()
export class Genre {
    @PrimaryGeneratedColumn()
    id: string

    @Column({type: "varchar", length: 20})
    name: string
}