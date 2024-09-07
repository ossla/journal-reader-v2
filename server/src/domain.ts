import fileUpload from "express-fileupload"

export type CustomFileType = fileUpload.UploadedFile | fileUpload.UploadedFile[] | undefined

export function makeFolderName(name: string) {
    return name.replace(/\s/, '_')
}