import fs from "fs"

class contenedor{
    constructor(path){
        this.path = path
    }

    //traer todos los productos
    getAll = async() =>{
        try {
            if(fs.existsSync(this.path)){
                let info = await fs.promises.readFile(this.path, 'utf-8');
                let products = JSON.parse(info);
                return products
            }else{
                console.log
            }
        } catch (error) {
            console.log(error)
        }
    }

    //agregar productos
    save = async({title,price,thumbnail,stock}) =>{
        let allProducts = await this.getAll();
        let newProduct = {title,price,thumbnail,stock}
        try {
            if(allProducts.length === 0){
                producto.id = 0;
                allProducts.push(newProduct)
                await fs.promises.writeFile(this.path, JSON.stringify(allProducts,null,'\t'))
            }else{
                producto.id = allProducts[allProducts.length-1].id+1
                allProducts.push(newProduct)
                await fs.promises.writeFile(this.path,JSON.stringify(allProducts,null,'\t'))
            }
        } catch (error) {
            console.log(error)
        }
    }

    //traer por id
    getById = async(number) =>{
        let stock = await this.getAll();
        try {
            let filter = stock.find(e => e.id == number)
            return filter
        } catch (error) {
            console.log(error)
        }
    }

    //borrar por id
    deleteById = async(number) =>{
        let stock = await this.getAll();
        try {
            let filter = stock.filter(product =>product.id != number)
            await fs.promises.writeFile(this.path, JSON.stringify(filter,null,'\t'))
        } catch (error) {
            console.log(error);
        }
    }

    //borrar el archivo
    deleteAll = async() =>{
        try {
            await fs.promises.writeFile(this.path,JSON.parse('[]'))
        } catch (error) {
            console.log(error)
        }
    }

    //actualizar producto
    update = async({id, objeto}) =>{
        let productos = await this.getAll();
        objeto.id = id
        productos.map(function(item){
            if(item.id == objeto.id){
                item.title = objeto.title,
                item.price = objeto.price,
                item.thumbnail = objeto.thumbnail
            }
        })
        await fs.promises.writeFile(this.path,JSON.stringify(productos,null,'\t'))
        return productos
    }
}

export default contenedor;