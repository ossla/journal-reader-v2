import { DataSource } from "typeorm"
import { User } from "./entities/user.entity"
import { Favorite } from "./entities/favorites.entity"
import { Chapter } from "./entities/chapter.entity"
import { Author } from "./entities/author.entity"
import { Genre } from "./entities/genre.entity"
import { Journal } from "./entities/journal.entity"

export const dataSource: DataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "oosla",
    database: "journal_db",
    password: "1234",
    synchronize: true,
    entities: [
        User,
        Genre,
        Author,
        Journal,
        Chapter,
        Favorite
    ]
})