"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_data_source_1 = require("./app-data-source");
const router_1 = __importDefault(require("./routes/router"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const user_entity_1 = require("./entities/user.entity");
const processApiError_1 = require("./error/processApiError");
const path = __importStar(require("path"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.PORT || 5001;
app.use(express_1.default.json());
app.use(express_1.default.text());
// запросы с любого IP:
app.use((0, cors_1.default)());
// Для парсинга application/xwww-form-urlencoded|multipart/form-data:
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, express_fileupload_1.default)());
// routes
app.use("/api", router_1.default);
app.use(express_1.default.static(path.join(__dirname, "..", "public")));
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield app_data_source_1.dataSource
                .initialize()
                .then(() => {
                console.log("Data Source has been initialized!");
            });
            yield app_data_source_1.dataSource.getRepository(user_entity_1.User);
            app.listen(port, () => {
                console.log(`[server]: Server is running at http://localhost:${port}`);
            });
        }
        catch (error) {
            (0, processApiError_1.processDefaultError)(error);
        }
    });
}
start();
