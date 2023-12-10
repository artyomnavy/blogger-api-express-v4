import {OutputUsersType, UsersType} from "./output";
import {WithId} from "mongodb";

export const userMapper = (user: WithId<UsersType>): OutputUsersType => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}