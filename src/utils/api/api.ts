import express from "express";
import routes  from "../../routes";
import cookieParser from "cookie-parser";
import errorHandler from "../../middlewares/errors/errorHandler";
import path from "node:path";
import cors from "cors";


const api = express()
api.use(cors({
    origin: ["https://127.0.0.1:3000", "https://bookstore-gules-xi.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

api.use(cookieParser());
api.use(express.json());
api.use(routes);
api.use("/", express.static(path.resolve("docs")));
//api.use("/images", express.static(path.resolve("images")));
api.use(errorHandler);

export default api;