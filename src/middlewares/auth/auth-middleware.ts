import {Request, Response, NextFunction} from "express";
import {Buffer} from 'node:buffer'
import {HTTP_STATUSES} from "../../utils";

// Basic auth with use 'express-basic-auth'
// 1) In terminal add command: yarn add express-basic-auth
// 2) import basicAuth from "express-basic-auth"
// 3) const auth = {
//     users: {
//         admin: 'qwerty'
//     }
// }
// 4) export const authMiddleware = basicAuth(auth)

const login = 'admin'
const password = 'qwerty'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    //Simple way
    /*if (req.headers['authorization'] !== 'Basic YWRtaW46cXdlcnR5') {
        res.sendStatus(401)
        return
    }
    return next()
    */

    const auth = req.headers['authorization']

    if (!auth) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const [basic, token] = auth.split(' ')

    if (basic !== 'Basic') {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const decodedData = Buffer.from(token, 'base64').toString()
    //admin:password

    const [decodedLogin, decodedPassword] = decodedData.split(':')

    if (decodedLogin !== login || decodedPassword !== password) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    return next()
}