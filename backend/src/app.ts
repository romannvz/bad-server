import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import fs from 'fs'
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

const { PORT = 3000 } = process.env
const app = express()

app.use(cookieParser())

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'

app.use(
    cors({
        origin: CORS_ORIGIN,
        credentials: true,
    })
)

const tempDir = path.join(__dirname, 'public', 'temp')
const uploadDir = path.join(__dirname, 'public', 'uploads')

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
    console.log(`Created temp directory: ${tempDir}`)
}

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
    console.log(`Created upload directory: ${uploadDir}`)
}

const altTempDir = path.join(process.cwd(), 'public', 'temp')
if (!fs.existsSync(altTempDir)) {
    fs.mkdirSync(altTempDir, { recursive: true })
    console.log(`Created alternative temp directory: ${altTempDir}`)
}

const anotherTempDir = '/tmp/uploads'
if (!fs.existsSync(anotherTempDir)) {
    fs.mkdirSync(anotherTempDir, { recursive: true })
    console.log(`Created another temp directory: ${anotherTempDir}`)
}

// app.use(cors({ origin: ORIGIN_ALLOW, credentials: true }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(urlencoded({ extended: true, limit: '10kb' }))
app.use(json({ limit: '10kb' }))

app.use(apiLimiter)

app.use('/product', apiLimiter)
app.use('/customers', apiLimiter)
app.use('/auth/login', authLimiter)
app.use('/auth/register', authLimiter)
app.use('/upload', uploadLimiter)
app.use('/order', orderLimiter)

app.use(serveStatic(path.join(__dirname, 'public')))

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
