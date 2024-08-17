import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

interface CustomRequest extends Request {
    user?: any;
}

export const authMiddleware = async(req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]
    if(!token) {
        return res.status(401).json({ error: "Unauthorized" })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "")
        req.user = decoded
        next();
    } catch (error) {
        console.log("error in middleware", error)
    }
}