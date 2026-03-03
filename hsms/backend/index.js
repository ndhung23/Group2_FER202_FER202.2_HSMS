import express, { request, response } from "express";
import tasksRouters from "./routers/tasksRouters.js";
import { connectDB } from "./src/config/db.js";
import dotenv from "dotenv";
import cors from "cors"; //cn backend
import path from "path";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5001;

//git
const __dirname = path.resolve();

//middlewares
app.use(express.json());

//cn backend (2):dung de chay tren moi truong development
if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: ["http://localhost:5173", "http://abc.com"] }));
}

app.use("/api/tasks", tasksRouters);

//git
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

//Ket noi databe xong moi chay o cong 5001
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server start with port ${PORT}");
  });
});
