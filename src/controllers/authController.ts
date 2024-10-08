import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();
dotenv.config()

const generateToken = (userId: number) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || "", { expiresIn: '1h' })

}

export const signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ error: "User already exits" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name }
        })

        const token = generateToken(user.id)
        return res.status(200).json({ user, token })
    } catch (error) {
        console.log("Error in sing up user")
    }
}

export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if(!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" })
        }
        const token = generateToken(user.id)
        res.status(200).json({ user, token })
    } catch (error) {
        console.log("error in signing in the user")
    }
}