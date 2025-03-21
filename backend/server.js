import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config(); // Load environment variables

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
