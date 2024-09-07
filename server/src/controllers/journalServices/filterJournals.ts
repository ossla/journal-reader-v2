import { Request, Response, NextFunction } from "express"
import processApiError from "../../error/processApiError"
import { In } from "typeorm"
import { Journal } from "../../entities/journal.entity"
import { dataSource } from "../../app-data-source"


class filterService {
    private static instance: filterService;

    public static getInstance(limit: number, offset: number) {
        if (!filterService.instance) {
            filterService.instance = new filterService(limit, offset);
        }
        return filterService.instance;
    }

    limit: number = 9
    offset: number = 0

    private constructor(limit: number, offset: number) {
        this.limit = limit
        this.offset = offset
    }

    async getWithGenresAuthorsYear(rawGenres: string, rawAuthors: string,
                                         year: number): Promise<Journal[]> {
        const genres: string[] = JSON.parse(rawGenres)
        const authors: string[] = JSON.parse(rawAuthors)
        return await dataSource.getRepository(Journal)
                .find({where: {
                        genres: { name: In(genres) },
                        authors: { name: In(authors) },
                        year: year
                    },
                    relations: {genres: true, authors: true},
                    skip: this.offset,
                    take: this.limit
                });
    }
    async getWithGenresAuthors(rawGenres: string, rawAuthors: string
                                    ): Promise<Journal[]> {
        const genres: string[] = JSON.parse(rawGenres)
        const authors: string[] = JSON.parse(rawAuthors)
        return await dataSource.getRepository(Journal)
                .find({where: {
                        genres: { name: In(genres) },
                        authors: { name: In(authors) }
                    },
                    relations: {genres: true, authors: true},
                    skip: this.offset,
                    take: this.limit
                });
    }
    async getWithGenresYear(rawGenres: string, year: number
                                    ): Promise<Journal[]> {
        const genres: string[] = JSON.parse(rawGenres)
        return await dataSource.getRepository(Journal)
                .find({where: {
                        genres: { name: In(genres) },
                        year: year
                    },
                    relations: {genres: true, authors: true},
                    skip: this.offset,
                    take: this.limit
                });
    }
    async getWithAuthorsYear(rawAuthors: string, year: number
                                    ): Promise<Journal[]> {
        const authors: string[] = JSON.parse(rawAuthors)
        return await dataSource.getRepository(Journal)
                .find({where: {
                        authors: { name: In(authors) },
                        year: year
                    },
                    relations: {genres: true, authors: true},
                    skip: this.offset,
                    take: this.limit
                });
    }
    async getWithAuthors(rawAuthors: string): Promise<Journal[]> {
        const authors: string[] = JSON.parse(rawAuthors)
        return await dataSource.getRepository(Journal)
                .find({where: {
                        authors: { name: In(authors) }
                    },
                    relations: {genres: true, authors: true},
                    skip: this.offset,
                    take: this.limit
                });
    }
    async getWithGenres(rawGenres: string): Promise<Journal[]> {
        const genres: string[] = JSON.parse(rawGenres)
        return await dataSource.getRepository(Journal)
                .find({where: {
                        genres: { name: In(genres) }
                    },
                    relations: {genres: true, authors: true},
                    skip: this.offset,
                    take: this.limit
                });
    }
    async getWithYear(year: number): Promise<Journal[]> {
        return await dataSource.getRepository(Journal)
                .find({where: { year: year },
                    relations: {genres: true, authors: true},
                    skip: this.offset,
                    take: this.limit
                });
    }
    async getAll(): Promise<Journal[]> {
        console.error("getAll request, no filter data. use GET ..api/journals/")
        return await dataSource.getRepository(Journal)
                .find({
                    relations: {genres: true, authors: true},
                    skip: this.offset,
                    take: this.limit
                })
    }
}


export async function handleFilterData(req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        
        const page: number = Number(req.body.page) || 1
        const limit: number = Number(req.body.limit) || 9
        const offset = limit * (page - 1)

        const service = filterService.getInstance(limit, offset);

        const rawGenres: string | undefined = req.body.genres
        const rawAuthors: string | undefined = req.body.authors
        const year: number | undefined = req.body.year
        
        const upperYear: number | undefined = req.body.upperYear
        const lowerYear: number | undefined = req.body.lowerYear
        if (year && upperYear || year && lowerYear) {
            throw new Error("укажите только один тип фильтрации по году: год ИЛИ годовой промежуток")
        }
        
        let response: Journal[];
        if (rawGenres && rawAuthors && year) { // genres & authors & year
            response = await service.getWithGenresAuthorsYear(rawGenres, rawAuthors, year);
            
        } else if (rawGenres && rawAuthors && !year) { // genres & authors
            response = await service.getWithGenresAuthors(rawGenres, rawAuthors)
        } else if (rawGenres && !rawAuthors && year) { // genres & year
            response = await service.getWithGenresYear(rawGenres, year)
        } else if (!rawGenres && rawAuthors && year) { // authors & year
            response = await service.getWithAuthorsYear(rawAuthors, year)
        } else if (rawGenres && !rawAuthors && !year) {  // genres
            response = await service.getWithGenres(rawGenres)
        } else if (!rawGenres && rawAuthors && !year) { // authors
            response = await service.getWithAuthors(rawAuthors)
        } else if (!rawGenres && !rawAuthors && year) { // year
            response = await service.getWithYear(year)
        } else { // all (better use GET getAll)
            response = await service.getAll()
        }

        if (lowerYear) {
            response.filter(j => j.year >= lowerYear)
        }
        if (upperYear) {
            response.filter(j => j.year <= upperYear)
        }

        res.json(response)

    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}