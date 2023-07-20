import express from 'express';
import __dirname from "./utils.js";
import productsRoute from "./routes/products.router.js";
import cartsRoute from "./routes/carts.router.js";
import viewsRoute from "./routes/views.router.js";
import handlebars from "express-handlebars";
/* import messagesRoute from "./routes/messages.router.js"; */
import mongoose from "mongoose";
import { messageModel } from "./dao/mongo/models/messages.model.js";
import { Server } from "socket.io";

const app = express();
const PORT = 8080;

// Data
import products from "./data/products.json" assert { type: "json" };

/* Mongoose */
const enviroment = async () => {
    await mongoose.connect("mongodb+srv://irandazzo:Huracan7314@cluster0.0xjxasx.mongodb.net/?retryWrites=true&w=majority");
};
enviroment();

/* Handlebars */
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

/* Middlewares */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/products", productsRoute);
app.use("/api/carts", cartsRoute);
/* app.use("/messages", messagesRoute); */
app.use("/", viewsRoute);

/* Socket & Server */
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor Arriba en Puerto: ${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log(`Client ${socket.id} connected`);

  socket.emit("products", products);

  // Recibir usuarios, mensajes y crear entrada en DB:
  socket.on("user", async (data) => {
    await messageModel.create({
      user: data.user,
      message: data.message,
    });

    const messagesDB = await messageModel.find();
    io.emit("messagesDB", messagesDB);
  });

  socket.on("message", async (data) => {
    await messageModel.create({
      user: data.user,
      message: data.message,
    });

    const messagesDB = await messageModel.find();
    io.emit("messagesDB", messagesDB);
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});