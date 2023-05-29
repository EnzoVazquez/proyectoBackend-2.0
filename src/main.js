import express from "express";
import productsRouter from "./routes/productsRouter.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import views from "./routes/viewsRouter.js";
import cartRouter from "./routes/cartRouter.js";
import sessionRouter from "./routes/sessionsRouter.js";
import initializePassport from "./configs/passport.config.js";
import passport from "passport";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import config from "./configs/config.js";

const app = express();
const PORT = process.env.PORT || 8080;
const connection = mongoose.connect(config.mongo.URL)

app.listen(PORT, () => console.log(`escuchando en el puerto ${PORT}`));


//middlewares
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//seteo passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


//seteo motor de vistas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//vistas
app.use("/", views);
app.use("/api/productos", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/sessions", sessionRouter);
