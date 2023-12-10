import {PaginatorUserModel} from "../types/user/input";
import {PaginatorUsersType} from "../types/user/output";
import {usersCollection} from "../db/db";
import {userMapper} from "../types/user/mapper";

export const usersQueryRepository = {
    async getAllUsers(QueryData: PaginatorUserModel): Promise<PaginatorUsersType> {
        const sortBy = QueryData.sortBy ?
                QueryData.sortBy :
                'createdAt'
        const sortDirection = QueryData.sortDirection ?
            QueryData.sortDirection :
            'desc'
        const pageNumber = QueryData.pageNumber ?
            QueryData.pageNumber :
            1
        const pageSize = QueryData.pageSize ?
            QueryData.pageSize :
            10
        const searchLoginTerm = QueryData.searchLoginTerm ?
            QueryData.searchLoginTerm :
            null
        const searchEmailTerm = QueryData.searchEmailTerm ?
            QueryData.searchEmailTerm :
            null

        let filterLogin = {}
        let filterEmail = {}

        if (searchLoginTerm) {
            filterLogin = {
                login: {
                    $regex: searchLoginTerm,
                    $options: 'i'
                }
            }
        }

        if (searchEmailTerm) {
            filterEmail = {
                email: {
                    $regex: searchEmailTerm,
                    $options: 'i'
                }
            }
        }

        const filter = {
            $or: [
                filterLogin,
                filterEmail
            ]
        }

        const users = await usersCollection
            .find(filter)
            .sort({[sortBy]: sortDirection === 'desc' ? -1 : 1})
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount = await usersCollection
            .countDocuments(filter)

        const pagesCount = Math.ceil(+totalCount / +pageSize)

        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: users.map(userMapper)
        }
    },
    async getUserByLoginOrEmail(loginOrEmail: string): Promise<{password: string} | null> {
        const filter = {
            $or: [
                {login: loginOrEmail},
                {email: loginOrEmail}
            ]
        }

        const user = await usersCollection
            .findOne(filter)

        if (!user) {
            return null
        } else {
            return {
                password: user.password}
        }
    }
}