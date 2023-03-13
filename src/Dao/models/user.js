import mongoose from "mongoose";
const userCollection = "users";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'usuario' }
  });

export const userModel = mongoose.model(userCollection, userSchema)