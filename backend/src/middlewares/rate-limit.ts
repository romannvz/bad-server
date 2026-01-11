import { rateLimit } from 'express-rate-limit'
import { Request } from 'express'

export const apiLimiter = rateLimit({
    windowMs: 1000,
    max: 10,
    message: {
        error: 'Слишком много запросов с этого IP',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    keyGenerator: (req: Request) => {
        const forwarded = req.headers['x-forwarded-for']
        const ip = forwarded
            ? (Array.isArray(forwarded) ? forwarded[0] : forwarded)
                  .split(',')[0]
                  .trim()
            : req.ip || req.socket.remoteAddress || 'unknown'
        return ip
    },
    handler: (_req, res) => {
        res.status(429).json({
            error: 'Слишком много запросов с этого IP',
        })
    },
})

export const authLimiter = rateLimit({
    windowMs: 1000,
    max: 2,
    message: {
        error: 'Слишком много попыток входа',
    },
    skipSuccessfulRequests: false,
    standardHeaders: true,
})

export const uploadLimiter = rateLimit({
    windowMs: 1000,
    max: 2,
    message: {
        error: 'Слишком много загрузок файлов',
    },
    standardHeaders: true,
})

export const orderLimiter = rateLimit({
    windowMs: 1000,
    max: 2,
    message: {
        error: 'Слишком много заказов',
    },
    standardHeaders: true,
})
