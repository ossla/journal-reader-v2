"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDefaultError = void 0;
const apiError_1 = __importDefault(require("./apiError"));
function processDefaultError(error) {
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    else if (typeof error === "string") {
        throw new Error(error);
    }
    else {
        throw new Error("unexpected err");
    }
}
exports.processDefaultError = processDefaultError;
function processApiError(status, error, next) {
    if (error instanceof Error) {
        if (status === 404) {
            next(apiError_1.default.badRequest(error.message));
        }
        else {
            next(apiError_1.default.internal(error.message));
        }
    }
    else if (typeof error === "string") {
        next(apiError_1.default.badRequest(error));
    }
    else {
        throw new Error("unexpected err");
    }
}
exports.default = processApiError;
