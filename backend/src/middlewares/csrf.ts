import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

export const csrfProtection = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.method === 'OPTIONS') return next()

    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next()

    if (req.path === '/csrf-token') return next()

    const tokenFromHeader = req.headers['x-csrf-token'] as string
    const tokenFromCookie = req.cookies['csrf-token']

    if (
        !tokenFromHeader ||
        !tokenFromCookie ||
        tokenFromHeader !== tokenFromCookie
    )
        return res.status(403).json({ error: 'Invalid CSRF token' })

    next()
}

export const getCsrfToken = (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = crypto.randomBytes(32).toString('hex')

    res.cookie('csrf-token', token, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
    })

    res.locals.csrfToken = token
    next()
}
