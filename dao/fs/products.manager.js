import fs from "fs";

export default class ProductsManager {
    #products;
    #path;

    constructor(fileName) {
        this.#products = [];
        this.#path = `./src/data/${fileName}.json`;
    }
getProducts() {
    // Validar si existe el archivo:
    if (!fs.existsSync(this.#path)) {
    try {
        // Si no existe, crearlo:
        fs.writeFileSync(this.#path, JSON.stringify(this.#products));
    } catch (error) {
        return `Error al obtener los productos ${error}`;
    }
}
/* Leer archivo y convertirlo en objeto: */
    try {
    const data = fs.readFileSync(this.#path, "utf8");
    const dataArray = JSON.parse(data);
    return dataArray;
    } catch (error) {
    return `Error al obtener los productos ${error}`;
    }
}
lastId() {
    const products = this.getProducts();
/* Obtener y devolver último ID: */
    if (products.length > 0) {
    const lastId = products.reduce((maxId, product) => {
        return product.id > maxId ? product.id : maxId;
    }, 0);
    return lastId;
    }
/* Si el array está vacío, devolver 0: */
    return 0;
}
addProduct(newProduct) {
    try {
    const products = this.getProducts();

/* Validar campos incompletos: */
    if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.status || !newProduct.stock || !newProduct.category) {
        return `Complete todos los campos para poder agregar el producto`;
    }

/* Validar si el código existe: */
    if (products.some((product) => product.code == newProduct.code)) {
        return `The code ${newProduct.code} already exists`;
    }
/* Si es correcto, agregar producto con ID y escribir el archivo: */
    const id = this.lastId() + 1;
    newProduct.id = id;
    const product = newProduct;
    products.push(product);
    fs.writeFileSync(this.#path, JSON.stringify(products));
    return `Product ${newProduct.id} added`;
    } catch (error) {
    return `Error al agregar el producto ${error}`;
    }
}
getProductById(id) {
    try {
    const products = this.getProducts();
    const product = products.find((product) => product.id === id);

      // Validar si el producto existe:
    if (!product) {
        return `There's no product with ID ${id}`;
    }
    return product;
    } catch (error) {
    return `Error de lectura del producto ${id}: ${error}`;
    }
}
updateProduct(id, updatedFields) {
    try {
    const products = this.getProducts();
    const product = products.find((product) => product.id === id);

/* Validar ID: */
    if (!product) {
    return `No existe el producto con el Id: ${id}`;
    }
/* Si es correcto, actualizar los campos y escribir el archivo: */
        for (const key in updatedFields) {
        if (key.toLowerCase() === "id") {
        return `No se puede actualizar el campo "ID"`;
        }

        if (!product.hasOwnProperty(key)) {
        return `Algún campo no existe o se encuentra erróneo`;
        }

        product[key] = updatedFields[key];
    }
        fs.writeFileSync(this.#path, JSON.stringify(products));
        return `Producto ${id} actualizado`;
    } catch (error) {
        return `Error al actualizar el producto ${id}: ${error}`;
    }
}

deleteProduct(id) {
    try {
        const products = this.getProducts();
        const productIndex = products.findIndex((product) => product.id === id);

        /* Validar ID: */
    if (productIndex === -1) {
        return `No existe el producto con el Id ${id}`;
    }

/* Si es correcto, borrar producto y escribir el archivo: */
        products.splice(productIndex, 1);
        fs.writeFileSync(this.#path, JSON.stringify(products));
        return `Product ${id} deleted`;
        }catch (error) {
        return `Error al eliminar el producto ${id}: ${error}`;
        }
    }
}