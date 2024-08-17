import express, { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();


interface CustomRequest extends Request {
    user?: any;
}

export const createPost = async (req: Request, res: Response) => {
    const { title, content, authorId } = req.body
    try {
        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId
            }
        })
        res.json(post)
    } catch (error) {
        console.log("error in creating post", error)
    }
}

export const getPosts = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const post = await prisma.post.findMany({
            include: {
                author: true
            }
        })
        res.status(200).json(post)
    } catch (error) {
        console.log("error in getting post", error)
    }
}

export const getPostById = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                author: true
            }
        })

        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }
    } catch (error) {
        console.log("error in get post by id ", error);
    }
}

export const updatePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: Number(id)
            }
        })
        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }
        const updatePost = await prisma.post.update({
            where: {
                id: Number(id)
            },
            data: {
                title,
                content
            }
        })
        res.status(200).json(updatePost)
    } catch (error) {
        console.log("error in updating post", error);

    }
}

export const deletePost = async (req: CustomRequest, res: Response) => {
    const { id } = req.params;

    try {
        const post = await prisma.post.findUnique({ where: { id: Number(id) } });

        if (!post || post.authorId !== req.user.userId) {
            return res.status(404).json({ error: 'Post not found or unauthorized' });
        }

        await prisma.post.delete({ where: { id: Number(id) } });

        res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};