import fs from "fs";

//Manejador de Productos
class ProductManager {
  constructor(path) {
    this.path = path;
  }
  //verifico si existe el archivo si no lo creo
  async validateExistFile() {
    try {
      await fs.promises.stat(this.path); //devuelvo la informacion sobre la ruta
      return true;
    } catch {
      await fs.promises.writeFile(this.path, JSON.stringify([])); // si no existe lo creo
      return false;
    }
  }
  //Leemos la informacion del Json en general
  async readData() {
    try {
      this.validateExistFile();
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch {
      console.log("Couldn't get the goods!");
    }
  }
  //Creo un metodo para guardar el objeto
  async saveObject(product) {
    try {
      const data = JSON.stringify(product, null, "\t");
      await fs.promises.writeFile(this.path, data);
    } catch (error) {
      throw new Error("Failed to save the products!", error);
    }
  }
  async addProduct(product) {
    //verifico que cumpla con la validacion
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock ||
      !product.category ||
      typeof product.title !== "string" ||
      typeof product.description !== "string" ||
      typeof product.code !== "string" ||
      typeof product.thumbnail !== "string" ||
      typeof product.price !== "number" ||
      typeof product.category !== "string" ||
      typeof product.stock !== "number"
     
    )
      throw new Error("Not Validate");
    try {
      const data = await this.readData();
      
      //creamos el id del producto
      let id;
      data.length === 0 ? (id = 1) : (id = data[data.length - 1].id + 1);
      //verifico que el codigo no sea igual
      if (data.some((e) => e.code === product.code)) {
        throw new Error("code already entered ")
      } else {
        const newProduct = {
          id: id,
          title: product.title,
          description: product.description,
          price: product.price,
          thumbnail:[ product.thumbnail],
          code: product.code,
          stock: product.stock,
          status: true,
          category: product.category
        };
        data.push(newProduct);
        await this.saveObject(data);
        return newProduct
      }
    } catch (error) {
      throw new Error(
        "There was a problem saving the requested product!",
        error
      );
    }
  }
  async getProducts() {
    try {
      const products = await this.readData();
      return products;
    } catch (error) {
      throw new Error("There are no products");
    }
  }
  async getProductById(id) {
    try {
      const products = await this.readData();
      const index = products.findIndex((product) => product.id === id);
      if (index < 0) {
        throw new Error("Id not found");
      }
      console.log(products[index]);
      return products[index];
    } catch (error) {
      throw new Error(
        "There was a problem searching for the requested product",
        error
      );
    }
  }
  async updateProduct(id, body) {
    const products = await this.readData();
    if (
      !body.description ||
      !body.title ||
      !body.price ||
      !body.thumbnail ||
      !body.code ||
      !body.stock ||
      !body.category ||
      typeof body.title !== "string" ||
      typeof body.description !== "string" ||
      typeof body.code !== "string" ||
      typeof body.thumbnail !== "string" ||
      typeof body.price !== "number" ||
      typeof body.category !== "string" ||
      typeof body.stock !== "number"
     
    )
      throw new Error("Not Validate");

    let flagUpdate = false;
    try {
      products.forEach((product) => {
        if (product.id === id) {
          product.title = body.title;
          product.description = body.description;
          product.price = body.price;
          product.thumbnail = [body.thumbnail];
          product.code = body.code;
          product.stock = body.stock;
          product.category= body.category;
          flagUpdate = true;
        }
      });
      if (flagUpdate) {
        await this.saveObject(products);
        console.log("updated product");
      } else {
        throw "The requested product does not exist!";
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async deleteProduct(id) {
    try {
      const products = await this.readData();
      const index = products.findIndex((product) => product.id === id);

      if (index < 0) {
        throw new Error("the product has to be deleted does not exist");
      }
      products.splice(index, 1);
      await this.saveObject(products)
      console.log("deleted product");
      
    } catch (error) {
      throw new Error("Error deleting product", error);
    }
  }
}

const path = "products.json";
const productManager = new ProductManager(path);


export default productManager;
