import { productModel } from "../models/products.js";
//Mostramos los productos
const allProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "";
    const query = req.query.query || "";

    const queryObject = {};
    if (query === "available") {
      queryObject.stock = { $gt: 0 };
    } else if (query === "unavailable") {
      queryObject.stock = { $lte: 0 };
    } else if (query) {
      queryObject.category = query;
    }

    const sortOrder = sort === "desc" ? -1 : 1;
    const sortObject = {};
    if (sort) {
      sortObject.price = sortOrder;
    }

    const products = await productModel.paginate(queryObject, {
      page,
      limit,
      sort: sortObject,
      lean: true,
    });

    const response = {
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.hasPrevPage ? page - 1 : null,
      nextPage: products.hasNextPage ? page + 1 : null,
      page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `${req.protocol}://${req.get("host")}/api/products?page=${
            page - 1
          }&limit=${limit}&sort=${sort}&query=${query}`
        : null,
      nextLink: products.hasNextPage
        ? `${req.protocol}://${req.get("host")}/api/products?page=${
            page + 1
          }&limit=${limit}&sort=${sort}&query=${query}`
        : null,
      sortValue: sort,
    };

    res.render("products", { response, user: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};
//Mostramos por Id el producto
const productId = async (req, res) => {
  const pid = req.params.pid;
  try {
    const productId = await productModel.findById(pid);
    console.log(productId);
    return res.render("detailProduct", productId);
  } catch {
    return res.status(404).send("el id no existe");
  }
};
//Agregamos productos
const addProduct = async (req, res) => {
  const body = req.body;
  try {
    let products = await productModel.find();
    if (products.some((e) => e.code === body.code)) {
      throw new Error("code already entered ");
    } else {
      await productModel.create(body);
      return res.status(201).json({ msg: "product saved successfully", body });
    }
  } catch {
    return res.status(500).json({ msg: "Error al crear el producto" });
  }
};
//Actualizamos un producto pasandole los datos necesarios
const updatedProduct = async (req, res) => {
  const body = req.body;
  const pid = req.params.pid;
  try {
    if (
      !body.title ||
      !body.description ||
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

    await productModel.findByIdAndUpdate(pid, body);
    return res.status(200).json({ msg: "product updated" });
  } catch {
    return res
      .status(500)
      .send("Error al actualizar el producto o faltante de algun campo");
  }
};
//Borramos el producto
const deleteProduct = async (req, res) => {
  const pid = req.params.pid;
  try {
    await productModel.findByIdAndRemove(pid);
    return res.status(200).json({ msg: "product deleted" });
  } catch {
    return res.status(400).json({
      error: "product not deleted or not exist",
    });
  }
};
export { allProducts, productId, addProduct, updatedProduct, deleteProduct };
