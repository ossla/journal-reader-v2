"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Journal = void 0;
const typeorm_1 = require("typeorm");
const chapter_entity_1 = require("./chapter.entity");
const author_entity_1 = require("./author.entity");
const genre_entity_1 = require("./genre.entity");
let Journal = class Journal {
};
exports.Journal = Journal;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], Journal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 40 }),
    __metadata("design:type", String)
], Journal.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], Journal.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Journal.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 40 }),
    __metadata("design:type", String)
], Journal.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Journal.prototype, "number_of_chapters", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => genre_entity_1.Genre),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Journal.prototype, "genres", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => author_entity_1.Author),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Journal.prototype, "authors", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chapter_entity_1.Chapter, (chapter) => chapter.journal, { onDelete: "CASCADE" }),
    __metadata("design:type", Array)
], Journal.prototype, "chapters", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Journal.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Journal.prototype, "updatedAt", void 0);
exports.Journal = Journal = __decorate([
    (0, typeorm_1.Entity)()
], Journal);
