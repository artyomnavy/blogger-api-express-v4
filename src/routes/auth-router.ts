import {Response, Router} from "express";
import {HTTP_STATUSES} from "../utils";
import {usersService} from "../domain/users-service";
import {RequestWithBody} from "../types/common";
import {AuthLoginModel} from "../types/auth/input";
import {authLoginValidation} from "../middlewares/validators/auth-validator";

export const authRouter = Router({})

authRouter.post('/login',
    authLoginValidation(),
    async (req: RequestWithBody<AuthLoginModel>, res: Response) => {
        let {
            loginOrEmail,
            password
        } = req.body

    const checkResult = await usersService
            .checkCredentials({loginOrEmail, password})

        if (!checkResult) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        } else {
            res.sendStatus(HTTP_STATUSES.CREATED_201)
        }
    })