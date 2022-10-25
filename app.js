const express = require("express")
const path = require("path")
const fs = require("fs/promises")


const app  = express()

const jsonPath = path.resolve("userData.json")
app.use(express.json())


app.get("/api/v1/users", async (req, res) =>{
  console.log("GET")
  const jsonFile = await fs.readFile(jsonPath, "utf-8")
 // console.log(jsonFile)
  res.status(200)
  res.send(jsonFile)
})

// usando useParams
app.get("/api/v1/user/:userId", async (req, res) =>{
  console.log("GET")
  const userId  = req.params
  
  const userArray = JSON.parse(await fs.readFile(jsonPath, "utf-8"))
  const userIndex = userArray.findIndex((user) => user.id === parseInt(userId.userId))
  const user = {
    "name": userArray[userIndex].name,
    "email": userArray[userIndex].email
  }
  //console.log(user);
  res.status(200)
  res.send(JSON.stringify(user))
})

app.post("/api/v1/users", async(req, res) =>{
  console.log("post")
  const newUser = req.body
  const userArray = JSON.parse(await fs.readFile(jsonPath, "utf-8"))
  userArray.push({...newUser, id: getLastId(userArray)})
  await fs.writeFile(jsonPath, JSON.stringify(userArray))
  res.sendStatus(200)
})

app.put("/api/v1/users", async (req, res) =>{
  console.log("put");
  const {id, password} = req.body
  const userArray = JSON.parse(await fs.readFile(jsonPath, "utf-8"))
  const userIndex = userArray.findIndex((user) => user.id === id)
  userArray[userIndex].password = password
  await fs.writeFile(jsonPath, JSON.stringify(userArray))
  res.sendStatus(200)
})

app.delete("/api/v1/users", async(req, res) =>{
  console.log("DETELE")
  const userArray = JSON.parse(await fs.readFile(jsonPath, "utf-8"))
  const id = req.body
  const userIndex = userArray.findIndex((user) => user.id === id)
  userArray.splice(userIndex, 1)
  await fs.writeFile(jsonPath, JSON.stringify(userArray))
  res.sendStatus(200)
})

app.listen(8000, () => {
  console.log("servidor funcionando al 100% en el puerto 8000");
})



const getLastId = (dataArray) =>{
  const lastElementIndex = dataArray.length - 1
  return dataArray[lastElementIndex].id + 1
}
