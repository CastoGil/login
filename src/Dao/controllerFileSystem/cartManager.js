import fs from "fs";
//Manejador de Carrito
class CartManager {
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
  //Leemos la informacion del Json en general con los productos
  async getAllProductsInCart() {
    try {
      this.validateExistFile();
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      throw new Error("Could not get items from cart!", error);
    }
  }
  //Creo un metodo para guardar el carrito
  async saveCarts(carts) {
    try {
      const data = JSON.stringify(carts, null, "\t");
      await fs.promises.writeFile(this.path, data);
    } catch {
      throw new Error("Carts could not be saved!");
    }
  }
  //creo el carrito
  async createCart() {
    try {
      const carts = await this.getAllProductsInCart();
      let id = 1;
      if (carts.length) {
        id = carts[carts.length - 1].id + 1;
      }
      const newCart = {
        id: id,
        products: [],
      };
      carts.push(newCart);

      await this.saveCarts(carts);
    } catch (error) {
      throw new Error("There was a problem creating the cart!", error);
    }
  }
  async getCartById(cid) {
    try {
      const productsCarts = await this.getAllProductsInCart();
      const indexCart = productsCarts.findIndex((cart) => cart.id === cid);
      if (indexCart < 0) {
        throw new Error("id Cart not found");
      }
      return productsCarts[indexCart];
    } catch {
      throw new Error("the id cart was not found");
    }
  }
  async addNewProductCart(cid, product) {
    try {
      const carts = await this.getAllProductsInCart();
      const indexCart = carts.findIndex((cart) => cart.id === cid);
      const position = carts[indexCart].products;
      const findProductId = position.find((e) => e.id === product.id);
      if (findProductId) {
        findProductId.quantity += 1;//sumamos la cantidad 
      } else {
        position.push(product);
      }
      //agregamos el producto al carrito
      await this.saveCarts(carts);
    } catch {
      throw new Error("Failed to add product to cart!");
    }
  }
}
const path = "carts.json";
const cartManager = new CartManager(path);

export default cartManager;
