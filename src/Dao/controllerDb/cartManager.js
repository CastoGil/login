import { productModel } from "../models/products.js";
import { cartModel } from "../models/carts.js";
///Creando un nuevo Carrito
const newCart = async (req, res) => {
  try {
    const createCart = new cartModel();
    await createCart.save();
    return res.status(200).json({ msg: "Cart created", createCart });
  } catch {
    return res.status(400).json({
      msg: `error cart not created`,
    });
  }
};
//Mostramos los productos del carrito seleccionado
const cartIdproduct = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartModel.findById(cartId).populate('products._id').lean().exec();
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found',
      });
    }
    console.log(cart)
   const products= cart.products
    res.render('cartsProduct',{cart:{products}});
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
}
///agregando productos al carrito seleccionado
const idCartIdProductAdd = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  try {
    const cartCid = await cartModel.findById(cid);
    const productId = await productModel.findById(pid);
   
    // Verificar si el producto ya está en el carrito
    const productInCarIndex = cartCid.products.findIndex(
      (product) => product.id === pid
    );
    
    //si ya se encuentra le sumo 1
    if (productInCarIndex !== -1) {
      cartCid.products[productInCarIndex].quantity += 1;

    } else {
      cartCid.products.push({ _id: productId, quantity: 1 });
    }
    await cartCid.save();
  return res.status(200).json({ msg: "product added", cartCid });
  } catch {
    return res.status(400).json({
      msg: "the product could not be added",
    });
  }
};
//eliminamos el producto del carrito seleccionado
const deleteProductId = async (req, res) => {
  try {
    const cart = await cartModel.findOneAndUpdate(
      { _id: req.params.cid },
      { $pull: { products: { _id: req.params.pid } } },
      { new: true }
    );
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//actualizamos el carrito con nuevos productos pasandole el arreglo de products con su _id y quantity
const updatedCart = async (req, res) => {
  try {
    const cart = await cartModel.findByIdAndUpdate(
      req.params.cid,
      { products: req.body.products },
      { new: true, runValidators: true, populate: { path: "products._id" } }
    );
    console.log(cart);
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//actualiza la cantidad del producto solicitado
const updatedQuantityProduct = async (req, res) => {
  try {
    const cart = await cartModel.findById(req.params.cid);
    const product = cart.products.find(
      (product) => product._id.toString() === req.params.pid
    );
    product.quantity = req.body.quantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteAllProductsFromCart = async (req, res) => {
  try {
    const cart = await cartModel.findById(req.params.cid);
    cart.products = [];
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  newCart,
  cartIdproduct,
  idCartIdProductAdd,
  deleteProductId,
  updatedCart,
  updatedQuantityProduct,
  deleteAllProductsFromCart,
};
