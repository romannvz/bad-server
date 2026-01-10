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
import helmet from 'helmet'
import { csrfMiddleware, getCsrfToken } from './middlewares/csrf'

const { PORT = 3000 } = process.env
const app = express()

app.use(cookieParser())

// app.use(csrfMiddleware)
// app.get('/csrf-token', getCsrfToken)

// const corsOptions = {
//     origin:
//         process.env.NODE_ENV === 'production'
//             ? process.env.ALLOWED_ORIGINS?.split(',') || true
//             : true,
//     credentials: true,
//     optionsSuccessStatus: 200,
// }

// app.use(cors())

// if (process.env.NODE_ENV === 'production')
//     app.use(
//         helmet({
//             contentSecurityPolicy: {
//                 directives: {
//                     defaultSrc: ["'self'"],
//                     scriptSrc: ["'self'", "'unsafe-inline'"],
//                     styleSrc: ["'self'", "'unsafe-inline'"],
//                     imgSrc: ["'self'", 'data:', 'https:'],
//                     fontSrc: ["'self'"],
//                     connectSrc: ["'self'"],
//                     frameAncestors: ["'none'"],
//                     baseUri: ["'self'"],
//                     formAction: ["'self'"],
//                 },
//             },
//             crossOriginEmbedderPolicy: false,
//         })
//     )
// else app.use(helmet())
// app.use(cors({ origin: ORIGIN_ALLOW, credentials: true }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true, limit: '10kb' }))
app.use(json({ limit: '10kb' }))

// app.use('/api/', apiLimiter)
// app.use('/auth/login', authLimiter)
// app.use('/auth/register', authLimiter)
// app.use('/upload', uploadLimiter)
// app.use('/order', orderLimiter)

app.options('*', cors())
app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
