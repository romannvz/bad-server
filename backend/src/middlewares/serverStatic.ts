import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

export default function serveStatic(baseDir: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const normalizedPath = path
            .normalize(req.path)
            .replace(/^(\.\.[\/\\])+/, '')
        const filePath = path.join(baseDir, normalizedPath)

        const relative = path.relative(baseDir, filePath)
        if (relative.startsWith('..') || path.isAbsolute(relative))
            return next()

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) return next()
            const ext = path.extname(filePath).toLowerCase()
            const allowedExtensions = [
                '.jpg',
                '.jpeg',
                '.png',
                '.gif',
                '.svg',
                '.webp',
                '.css',
                '.js',
                '.html',
            ]

            if (!allowedExtensions.includes(ext)) return next()
            return res.sendFile(filePath, (err) => {
                if (err) {
                    next(err)
                }
            })
        })
    }
}
