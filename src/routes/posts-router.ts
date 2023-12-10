import {Response, Router} from "express";
import {Params, RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types/common";
import {CreateAndUpdatePostModel, PaginatorPostModel} from "../types/post/input";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {ObjectIdValidation} from "../middlewares/validators/ObjectId-validator";
import {postsService} from "../domain/posts-service";
import {postsQueryRepository} from "../repositories/posts-db-query-repository";
import {HTTP_STATUSES} from "../utils";
import {postValidation} from "../middlewares/validators/posts-validator";

export const postsRouter = Router({})

postsRouter.get('/',
    async (req: RequestWithQuery<PaginatorPostModel>, res: Response) => {
    let {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection
    } = req.query

    const posts = await postsQueryRepository
        .getAllPosts({
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        })
    res.send(posts)
})

postsRouter.post('/',
    authMiddleware,
    postValidation(),
    async (req: RequestWithBody<CreateAndUpdatePostModel>, res: Response) => {

    let {
        title,
        shortDescription,
        content,
        blogId
    } = req.body

    const newPost = await postsService
        .createPost({
            title,
            shortDescription,
            content,
            blogId
        })

    res.status(HTTP_STATUSES.CREATED_201).send(newPost)

})

postsRouter.get('/:id',
    ObjectIdValidation,
    async (req: RequestWithParams<Params>, res: Response) => {

    const id = req.params.id

    let post = await postsQueryRepository
        .getPostById(id)

    if (!post) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    } else {
        res.send(post)
    }
})

postsRouter.put('/:id',
    authMiddleware,
    ObjectIdValidation,
    postValidation(),
    async (req: RequestWithParamsAndBody<Params, CreateAndUpdatePostModel>, res: Response) => {

    const id = req.params.id
    let {
        title,
        shortDescription,
        content,
        blogId
    } = req.body

    const post = await postsQueryRepository
        .getPostById(id)

    if (!post) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    let isUpdated = await postsService
        .updatePost(id, {
            title,
            shortDescription,
            content,
            blogId
        })

    if (isUpdated) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
})

postsRouter.delete('/:id',
    authMiddleware,
    ObjectIdValidation,
    async (req: RequestWithParams<Params>, res: Response) => {

    const id = req.params.id

    const isDeleted = await postsService
        .deletePost(id)

    if (isDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})