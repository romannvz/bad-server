import { rateLimit } from 'express-rate-limit'
import { Request } from 'express'

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { 
        error: 'Слишком много запросов с этого IP, пожалуйста, попробуйте позже.' 
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    keyGenerator: (req: Request) => req.ip || req.socket.remoteAddress || 'unknown',
    handler: (_req, res) => {
        res.status(429).json({ 
            error: 'Слишком много запросов с этого IP, пожалуйста, попробуйте позже.' 
        })
    }
})

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { 
        error: 'Слишком много попыток входа, попробуйте через 15 минут' 
    },
    skipSuccessfulRequests: false,
    standardHeaders: true,
})

export const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { 
        error: 'Слишком много загрузок файлов, попробуйте позже' 
    },
    standardHeaders: true,
})

export const orderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { 
        error: 'Слишком много заказов, попробуйте позже' 
    },
    standardHeaders: true,
})