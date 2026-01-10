import { Request, Response, NextFunction } from 'express'
import csrf from 'csurf'

const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    },
})

export const csrfMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const excludedPaths = [
        '/auth/login',
        '/auth/register', 
        '/auth/token',
        '/auth/logout'
    ];
    
    if (excludedPaths.includes(req.path)) return next();
    
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    
    return csrfProtection(req, res, next);
}

export const getCsrfToken = (req: Request, res: Response) =>
    res.json({ csrfToken: req.csrfToken() })
