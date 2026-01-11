import { rateLimit } from 'express-rate-limit'

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip + req.method + req.path,
})

export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, try again in an hour',
    skipSuccessfulRequests: true,
    standardHeaders: true,
})

export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: 'Too many file uploads, try again later',
    standardHeaders: true,
})

export const orderLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: 'Too many orders, try again later',
    standardHeaders: true,
})
