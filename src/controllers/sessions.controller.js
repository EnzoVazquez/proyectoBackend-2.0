import jwt from "jsonwebtoken";
import mongoCart from "../DAO/MongoDB/cartDAO.js";
import config from "../configs/config.js";
import UserDTO from "../DAO/DTO/userDTO.js";
import userModel from "../DAO/MongoDB/models/user.js";
import { createHash } from "../services/hash.js";

const cartService = new mongoCart();

const register = async (req, res) => {
  try {
    const file = req.file;
    if (!file)
      return res
        .status(500)
        .send({ status: "error", error: "error al cargar el archivo" });
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password)
      return res.status(400).send({ status: "error", error: "faltan valores" });
    const exist = await userModel.findOne({ email });
    if (exist)
      return res
        .status(400)
        .send({ status: "error", error: "el usuario ya existe" });
    const hashedPassword = await createHash(password);
    const cart = await cartService.createCart();
    let user = {
      avatar: `${req.protocol}://${req.hostname}:${process.env.PORT}/img/${file.filename}`,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      cart,
    };
    console.log(user);
    const result = await userModel.create(user);
    res.send({ status: "success", message: "registrado" });
  } catch (error) {
    res.status(500).send({ status: "error", error: "error del servidor" });
  }
};

const login = async (req, res) => {
  try {
    const userToken = UserDTO.getTokenDTO(req.user);
    console.log(userToken);
    const token = jwt.sign(userToken, config.jwt.SECRET, { expiresIn: "1d" });
    res
      .cookie(config.jwt.COOKIE, token)
      .send({ status: "success", message: "logged in" });
  } catch (error) {
    res.status(500).send({ status: "error", error: "Error del servidor" });
  }
};

const loginFail = async (req, res) => {
  res.send("Usuario no encontrado");
};

const githubCallback = async (req, res) => {
  const userToken = {
    name: `${req.user.name}`,
    role: "user",
    id: req.user._id,
  };

  const token = jwt.sign(userToken, config.jwt.SECRET, { expiresIn: "1d" });
  res
    .cookie(config.jwt.COOKIE, token)
    .send({ status: "success", message: "logged in" });
};

export default {
  login,
  loginFail,
  register,
  githubCallback,
};
