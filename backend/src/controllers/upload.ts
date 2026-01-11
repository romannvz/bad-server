import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import path from 'path'
import BadRequestError from '../errors/bad-request-error'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) return next(new BadRequestError('Файл не загружен'))
    try {
        const MIN_FILE_SIZE = 2 * 1024
        if (req.file.size < MIN_FILE_SIZE)
            return next(
                new BadRequestError(
                    'Файл слишком маленький. Минимальный размер: 2KB'
                )
            )

        const MAX_FILE_SIZE = 5 * 1024 * 1024
        if (req.file.size > MAX_FILE_SIZE)
            return next(
                new BadRequestError(
                    'Файл слишком большой. Максимальный размер: 5MB'
                )
            )

        const originalName = req.file.originalname
        const safeOriginalName = path.basename(originalName)

        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/uploads/${req.file.filename}`

        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: safeOriginalName,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
