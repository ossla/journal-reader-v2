import express, { Express } from "express"
import { dataSource } from "./app-data-source"
import router from "./routes/router"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import fileUpload from "express-fileupload"
import cors from "cors"
import { User } from "./entities/user.entity"
import { processDefaultError } from "./error/processApiError"
import * as path from "path";


const app: Express = express()
dotenv.config()
const port = process.env.PORT || 5001

app.use(express.json())
app.use(express.text())
// запросы с любого IP:
app.use(cors())
// Для парсинга application/xwww-form-urlencoded|multipart/form-data:
app.use(bodyParser.urlencoded({extended: false}))
app.use(fileUpload())
// routes
app.use("/api", router)
app.use(express.static(path.join(__dirname, "..", "public")))


async function start() {
    try {
        await dataSource
            .initialize()
            .then(() => {
                console.log("Data Source has been initialized!")
            })
        await dataSource.getRepository(User)

        app.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
            });

    } catch (error: unknown) {
        processDefaultError(error)
    }
}

start()