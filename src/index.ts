import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import postRoutes from "./routes/postRoutes"

dotenv.config();
const app = express();

app.use(express.json())

app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });