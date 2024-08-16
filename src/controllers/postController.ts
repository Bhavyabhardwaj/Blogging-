import express, { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany();
        res.json(posts)
    } catch (error) {
        console.log("error in getting posts", error)
    } 
}

export const createPost = async (req: Request, res: Response) => {
    const { title, content, authorId } = req.body;
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