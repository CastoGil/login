import { userModel } from "../models/user.js";
import bcrypt from "bcrypt";

const showRegisterForm = async (req, res) => {
  res.render("register");
};

const processRegisterForm = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificamos si el usuario ya existe en la base de datos
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.render("register", { error: "Email already in use" });
    }
    // Encriptamos la contraseña antes de almacenarla en la base de datos
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creamos el nuevo usuario y lo guardo en la base de datos
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: "usuario",
    });
    await newUser.save();
    res.redirect("/auth/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

const showLoginForm = async (req, res) => {
  res.render("login");
};

const processLoginForm = async (req, res) => {
  try {
    const { email, password } = req.body;
    //verificamos que sea Administrador
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.user = { email, role: "admin" };
      return res.redirect("/api/products");
    }
    // Verificar si el usuario existe en la base de datos
    const user = await userModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).send("El usuario no existe");
    }
    // Verificar si la contraseña es correcta
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Contraseña incorrecta");
    }

    req.session.user = { id: user._id, name: user.name, email: user.email ,  role: user.role};

    res.redirect("/api/products");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};
const closeSession = (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
};

export {
  processLoginForm,
  showRegisterForm,
  processRegisterForm,
  showLoginForm,
  closeSession,
};
