import fs from "fs";

export default class CartsManager {
  #carts;
  #path;

  constructor(fileName) {
    this.#carts = [];
    this.#path = `./src/data/${fileName}.json`;
  }

  getCarts() {
    // Validar si existe el archivo:
    if (!fs.existsSync(this.#path)) {
      try {
        // Si no existe, crearlo:
        fs.writeFileSync(this.#path, JSON.stringify(this.#carts));
    } catch (error) {
        return `Error al obtener el carrito ${error}`;
        }
    }

    // Leer archivo y convertirlo en objeto:
    try {
        const data = fs.readFileSync(this.#path, "utf8");
        const dataArray = JSON.parse(data);
        return dataArray;
    } catch (error) {
        return `No se pudo mostrar el carrito ${error}`;
    }
}

lastId() {
    const carts = this.getCarts();

    // Obtener y devolver último ID:
    if (carts.length > 0) {
    const lastId = carts.reduce((maxId, cart) => {
        return cart.id > maxId ? cart.id : maxId;
    }, 0);
    return lastId;
    }

    // Si el array está vacío, devolver 0:
    return 0;
}

addCart() {
    try {
    const carts = this.getCarts();
    const id = this.lastId() + 1;
    const newCart = {
        id: id,
        products: [],
    };

    // Agregar carrito y escribir el archivo:
    carts.push(newCart);
    fs.writeFileSync(this.#path, JSON.stringify(carts));
    return `Carrito agregado con ID: ${id}`;
    } catch (error) {
    return `Error al agregar el Carrito ${error}`;
    }
}

getCartById(id) {
    try {
        const carts = this.getCarts();
        const cart = carts.find((cart) => cart.id === id);

      // Validar si el carrito existe:
        if (!cart) {
        return `No existe Carrito con ID: ${id}`;
    }
        return cart.products;
    } catch (error) {
        return `Error al obtener el Carrito${id}: ${error}`;
    }
}
addProductToCart(cartId, productId) {
    try {
    const carts = this.getCarts();
    const cart = carts.find((cart) => cart.id === cartId);

    const product = cart.products.find(
        (product) => product.product === productId
    );

      // Validar si el producto ya está agregado:
        if (product) {
            product.quantity += 1;
        } else {
        // Si no, agregarlo:
        const newProduct = {
            product: productId,
            quantity: 1,
        };
            cart.products.push(newProduct);
        }
        fs.writeFileSync(this.#path, JSON.stringify(carts));
        return `Producto ${productId} agregado al Carrito: ${cartId}`;
        } catch (error) {
        return `Error al agregar el producto ${productId} al Carrito ${cartId}: ${error}`;
    }
}

  deleteCart(cartId, productId) {
    try {
      const carts = this.getCarts();
      const cart = carts.find((cart) => cart.id === cartId);

      // Validar ID de carrito:
      if (!cart) {
        return `There's no cart with ID ${cartId}`;
      }

      const productToDelete = cart.products.find(
        (item) => item.product === productId
      );

      // Validar ID de producto:
      if (!productToDelete) {
        return `There's no product ${productId} in cart ${cartId}`;
      }

      // Si es correcto, filtrar carrito, borrar producto y escribir el archivo:
      const filteredCart = cart.products.filter((item) => {
        return (
          item.product !== productToDelete.product ||
          item.quantity !== productToDelete.quantity
        );
      });
      cart.products = filteredCart;
      fs.writeFileSync(this.#path, JSON.stringify(carts));
      return `Producto ${productId} Eliminado del Carrito ${cartId}.`;
    } catch (error) {
      return `Error al eliminar el carrito ${cartId}: ${error}`;
    }
  }
}
