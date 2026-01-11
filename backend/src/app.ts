import helmet from 'helmet'
import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'
import {
    apiLimiter,
    authLimiter,
    orderLimiter,
    uploadLimiter,
} from './middlewares/rate-limit'
import { csrfProtection, getCsrfToken } from './middlewares/csrf'

const { PORT = 3000 } = process.env
const app = express()

app.use(cookieParser())

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'

app.use(
    cors({
        origin: CORS_ORIGIN,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    })
)

app.use(urlencoded({ extended: true, limit: '10kb' }))
app.use(json({ limit: '10kb' }))
app.use(helmet())

app.get('/csrf-token', getCsrfToken, (_req, res) => {
    res.json({ csrfToken: res.locals.csrfToken })
})

app.options('*', (_req, res) => {
    res.header('Access-Control-Allow-Origin', CORS_ORIGIN)
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    )
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-CSRF-Token'
    )
    res.sendStatus(200)
})

app.use(csrfProtection)

app.use(apiLimiter)
app.use('/product', apiLimiter)
app.use('/customers', apiLimiter)
app.use('/auth/login', authLimiter)
app.use('/auth/register', authLimiter)
app.use('/upload', uploadLimiter)
app.use('/order', orderLimiter)

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(routes)

app.use(errors())
app.use(errorHandler)

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () =>
            console.log(`Server started on port ${PORT}`)
        )
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
