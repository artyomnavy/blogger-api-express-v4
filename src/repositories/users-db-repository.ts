import {OutputUsersType, UsersType} from "../types/user/output";
import {ObjectId, WithId} from "mongodb";
import {usersCollection} from "../db/db";
import {userMapper} from "../types/user/mapper";

export const usersRepository = {
    async createUser(newUser: WithId<UsersType>): Promise<OutputUsersType> {
        const resultCreateUser = await usersCollection
            .insertOne(newUser)
        return userMapper(newUser)
    },
    async deleteUser(id: string): Promise<boolean> {
        const resultDeleteUser = await usersCollection
            .deleteOne({_id: new ObjectId(id)})
        return resultDeleteUser.deletedCount === 1
    }
}