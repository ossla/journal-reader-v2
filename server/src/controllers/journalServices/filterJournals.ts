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
    async getWithGenresAuthors(rawGenres: string, rawAuthors: string
                                    ): Promise<Journal[]> {
        const genres: string[] = JSON.parse(rawGenres)
        const authors: string[] = JSON.parse(rawAuthors)
        return await dataSource.getRepository(Journal)
                .find({where: {
                        genres: { name: In(genres) },
                        authors: { name: In(authors) }
                    },
                    relations: {genres: true, authors: true, chapters: false},
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
                    relations: {genres: true, authors: true, chapters: false},
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
                    relations: {genres: true, authors: true, chapters: false},
                    skip: this.offset,
                    take: this.limit
                });
    }
    async getAll(): Promise<Journal[]> {
        console.error("getAll request, no filter data. use GET ..api/journals/")
        return await dataSource.getRepository(Journal)
                .find({
                    relations: {genres: true, authors: true, chapters: false},
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
        let upperYear: number | undefined = req.body.upperYear
        let lowerYear: number | undefined = req.body.lowerYear
        if (year) { // if year exists, these entities will overlap
            upperYear = year;
            lowerYear = year;
        }

        let response: Journal[];
        if (rawGenres && rawAuthors) { // genres & authors
            response = await service.getWithGenresAuthors(rawGenres, rawAuthors)
        } else if (rawGenres && !rawAuthors) {  // genres
            response = await service.getWithGenres(rawGenres)
        } else if (!rawGenres && rawAuthors) { // authors
            response = await service.getWithAuthors(rawAuthors)
        } else { // all (better use GET request)
            response = await service.getAll()
        }

        if (lowerYear && upperYear) {
            response.filter(j => j.year >= lowerYear && j.year <= upperYear)
        } else if (lowerYear && !upperYear) {
            response.filter(j => j.year >= lowerYear)
        } else if (!lowerYear && upperYear) {
            response.filter(j => j.year <= upperYear)
        }

        res.json(response)

    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}