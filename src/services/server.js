import express from "express";
import mainRouter from "../routers/index.js";
import handlebars from "express-handlebars";
import __dirname from "../utils.js";
import viewsRouter from "../routers/views.router.js";
import { initWsServer } from "./socket.js";
import http from "http";
import chatRouter from "../routers/chatview.js";
import authRouter from "../routers/auth.js";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
dotenv.config();
import session from "express-session";
const uri = process.env.MONGO_URI;

const app = express();
const myHttpServer = http.Server(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const sessionStore = MongoStore.create({
  mongoUrl: uri,
  collectionName: "my-sessions",
  ttl: 60 * 60, // 1 hour
});

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
)

//iniciando handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

//rutas//
app.use("/api", mainRouter); //manejador de rutas
app.use("/", viewsRouter); // ruta websocket
app.use("/", chatRouter); // ruta chat
app.use("/auth", authRouter);
initWsServer(myHttpServer);



//middleware de ruta error
app.use((req, res, next) => {
  return res.status(404).json({
    error: -2,
    descripcion: `ruta ${req.url} not implemented`,
  });
});
export default myHttpServer;
