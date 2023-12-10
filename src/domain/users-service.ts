import {CreateUserModel} from "../types/user/input";
import {OutputUsersType} from "../types/user/output";
import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users-db-repository";
import bcrypt from 'bcrypt';
import {usersQueryRepository} from "../repositories/users-db-query-repository";
import {AuthLoginModel} from "../types/auth/input";

export const usersService = {
    async createUser(createData: CreateUserModel): Promise<OutputUsersType> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(createData.password, passwordSalt)

        const newUser = {
            _id: new ObjectId(),
            login: createData.login,
            password: passwordHash,
            email: createData.email,
            createdAt: new Date().toISOString()
        }

        const createdUser = await usersRepository
            .createUser(newUser)

        return createdUser
    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
    async checkCredentials(inputData: AuthLoginModel) {
        const user = await usersQueryRepository
            .getUserByLoginOrEmail(inputData.loginOrEmail)

        if (!user) {
            return false
        }

        const checkPassword = await bcrypt.compare(inputData.password, user.password)

        return  checkPassword
    },
    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository
            .deleteUser(id)
    }
}