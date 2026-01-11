import { Router } from 'express'
import { uploadFile } from '../controllers/upload'
import fileMiddleware from '../middlewares/file'
import { Role } from '../models/user'
import auth, { roleGuardMiddleware } from '../middlewares/auth'

const uploadRouter = Router()
uploadRouter.post(
    '/',
    auth,
    roleGuardMiddleware(Role.Admin),
    fileMiddleware.single('file'),
    uploadFile
)

export default uploadRouter
