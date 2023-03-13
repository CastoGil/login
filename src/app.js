import mongoose from "mongoose";
import myHttpServer from "./services/server.js";
const uri = process.env.MONGO_URI;

//conectamos a la base de datos//
mongoose.set("strictQuery", false);
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("Connected to database"),
  (error) => {
    if (error) {
      console.log("cannot connect to database" + error);
      process.exit();
    }
  };
//Servidor Escuchando//
const PORT = process.env.PORT || 8080;
myHttpServer.listen(PORT, () => console.log("server listening on port", PORT));


