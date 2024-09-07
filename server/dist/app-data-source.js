"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const favorites_entity_1 = require("./entities/favorites.entity");
const chapter_entity_1 = require("./entities/chapter.entity");
const author_entity_1 = require("./entities/author.entity");
const genre_entity_1 = require("./entities/genre.entity");
const journal_entity_1 = require("./entities/journal.entity");
exports.dataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "oosla",
    database: "journal_db",
    password: "1234",
    synchronize: true,
    entities: [
        user_entity_1.User,
        genre_entity_1.Genre,
        author_entity_1.Author,
        journal_entity_1.Journal,
        chapter_entity_1.Chapter,
        favorites_entity_1.Favorite
    ]
});
