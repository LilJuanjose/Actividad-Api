const express = require("express")
const path = require("path")
const fs = require("fs")
const morgan = require("morgan")
const app = express()

app.use(morgan('dev'))
app.use(express.json())

app.use("/api", require("./routes/empanadas"))

  app.get('/', (req, res) => {
    res.sendFile('./html/index.html', {root: __dirname})
})
  app.get('/carrito', (req, res) => {
    res.sendFile('./html/carrito.html', {root: __dirname})
})
  app.get('/compra', (req, res) => {
    res.sendFile('./html/compra-interna.html', {root: __dirname})
})
  app.get('/productos', (req, res) => {
    res.sendFile('./html/producto.html', {root: __dirname})
})
  app.get('/api', (req, res) => {
    res.sendFile('./routes/routes.html', {root: __dirname})
})

const Productos = fs.readFileSync('./empanadas.json', 'utf-8')
const JSONproductos = JSON.parse(Productos)
app.get('/api/productos', (req,res)=>{
  res.send(JSONproductos)
})

app.get("/api/productos/:id", (req,res) => {
  let id = req.params.id
  let ProductoSearch = JSONproductos.find(productos => productos.id == id)

  if(ProductoSearch != undefined)
    res.status(200).json(ProductoSearch)
  else
    res.json(`El producto ${id} no existe`)
})

app.post("/api/productos", (req, res) => {
  let id = JSONproductos.length + 1
  let {nombre, imagen} = req.body
  let NewProducto = {
    "id":id,
    "nombre" : nombre,
    "imagen" : imagen
  }
  JSONproductos.push(NewProducto)
  fs.writeFileSync('./empanadas.json', JSON.stringify(JSONproductos), 'utf-8')
  res.status(201).json(NewProducto)
})

app.put("/api/productos/:id", (req,res) => {
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

app.delete("/api/productos/:id", (req, res) => {
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

const Compra = fs.readFileSync('./compra.json', 'utf-8')
const JSONcompra = JSON.parse(Compra)
app.get('/api/compras', (req,res)=>{
  res.send(JSONcompra)
})

app.get('/api/compras/:id',(req,res)=>{
  let id = req.params.id
  let EmpanadaEncontrada = JSONcompra.find(empanada => empanada.id)
  if(EmpanadaEncontrada != undefined){
    res.status(200).json(EmpanadaEncontrada)
  }else{
    res.json(`La empanada ${id} no fue encontrada!`)
  }
})

app.post("/api/compras", (req, res) => {
  let id = JSONcompra.length + 1
  let {empanada, precio, cantidad} = req.body
  let NewEmpanada = {
    "id":id,
    "empanada":empanada,
    "precio":precio,
    "cantidad":cantidad
  }
  JSONcompra.push(NewEmpanada)
  fs.writeFileSync('./compra.json', JSON.stringify(JSONcompra), 'utf-8')
  res.status(201).json(NewEmpanada)
})

app.put("/api/compras/:id", (req,res) => {
  let id = req.params.id 
  let {empanada, precio, cantidad} = req.body
  let empaPut = JSONcompra.find(empanad => {
    if(empanad.id == id){
      empanad.empanada = empanada
      empanad.precio = precio
      empanad.cantidad = cantidad
      return empanad
    }
  })
  if(empaPut != undefined){
    fs.writeFileSync('./compra.json', JSON.stringify(JSONcompra), 'utf-8')
    res.status(201).json(empaPut)
  }else{
    res.status(200).json(`La empanada ${id} no existe`)
  }
  
})

app.delete("/api/compras/:id", (req, res) => {
  let id = req.params.id
  let nombre = req.param.empanada
  let indexCompra = JSONcompra.findIndex(product => product.id == id)
  if(indexCompra != -1){
    JSONcompra.splice(indexCompra, 1)
    fs.writeFileSync('./compra.json', JSON.stringify(JSONcompra), 'utf-8')
    res.status(200).json({mensaje : `La empanada ${nombre} fue eliminada`})
  }else{
    res.json(`El producto ${empanda} no existe`)
  }
})

app.set("puerto", 9000)

app.listen(app.get("puerto"), () => {
  console.log(`Servidor corriendo en el puerto ${app.get("puerto")}`)
})

