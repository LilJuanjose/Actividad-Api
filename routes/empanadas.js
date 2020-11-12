const {Router} = require("express")
const router = Router()
const fs = require("fs")
const Productos = fs.readFileSync('./empanadas.json', 'utf-8')
const JSONproductos = JSON.parse(Productos)

router.get("/api/productos/:id", (req,res) => {
  let id = req.params.id
  let ProductoSearch = JSONproductos.find(productos => productos.id == id)

  if(ProductoSearch != undefined)
    res.status(200).json(ProductoSearch)
  else
    res.json(`El producto ${id} no existe`)
})

router.post("/api/productos", (req, res) => {
  let id = JSONproductos.length + 1
  let {nombre, precio} = req.body
  let NewProducto = {
    "id":id,
    "nombre" : nombre,
    "precio" : precio
  }
  JSONproductos.push(NewProducto)
  fs.writeFileSync('./empanadas.json', JSON.stringify(JSONproductos), 'utf-8')
  res.status(201).json(NewProducto)
})

router.put("/api/productos/:id", (req,res) => {
  let id = req.params.id 
  let {nombre, precio} = req.body

  let productoPut = JSONproductos.find(product => {
    if(product.id == id){
      product.nombre = nombre
      product.precio = precio
      return product
    }
  })
  if(productoPut != undefined){
    fs.writeFileSync('./empanadas.json', JSON.stringify(JSONproductos), 'utf-8')
    res.status(201).json(productoPut)
  }else{
    res.status(200).json(`El id del producto ${id} no existe`)
  }
  
})

router.delete("/api/productos/:id", (req, res) => {
  let id = req.params.id
  let indexProducto = JSONproductos.findIndex(product => product.id == id)
  if(indexProducto != -1){
    JSONproductos.splice(indexProducto, 1)
    fs.writeFileSync('./empanadas.json', JSON.stringify(JSONproductos), 'utf-8')
    res.status(200).json({mensaje : `El producto ${id} fue eliminado`})
  }else{
    res.json(`El producto ${id} no existe`)
  }
})

module.exports = router