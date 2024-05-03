const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static(path.resolve("")));

let randomArr = []
let lobbyArr = []
let playerArray = []
let playerOneArray = []
let playerTwoArray = []


io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("find", (e) => {
    if (e.name != null) {
        randomArr.push(e.name)
        if (arr.length >= 2) {
            let p1obj = {
                p1name:arr[0],
                p1value: "red",
                p1move: "",
                p1arr:[],
                p1score: 0
            }
            let p2obj = {
                p2name:arr[1],
                p2value: "yellow",
                p2move: "",
                p2arr: [],
                p2score: 0
            }

            let randomLobby = generateLobbyCode() 

            let obj = {
                p1:p1obj,
                p2:p2obj,
                sum:1,
                lobby: randomLobby

            }

            randomArr = [];

            playerArray.push(obj)
            console.log(playerArray)
            

            io.emit('find', {allPlayers: playerArray})

        }
    }
  })

  socket.on("create", (e) => {
    
  })

  socket.on("join", (e) => {
    
  })



  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

});

app.get('/', (req,res) => {
    return res.sendFile("index.html")
})

server.listen(3000, ()=> {
    console.log("port connected to 3000")
})

function generateLobbyCode() {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}