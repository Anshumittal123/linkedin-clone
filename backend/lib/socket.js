import { Server } from "socket.io"
import http from "http"
import express from "express"
import { Socket } from "dgram";


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
})

io.on("connection", (Socket)=>{
    console.log("A user connected", Socket.id);

    Socket.on("disconnect", ()=>{
        console.log("A user disconnected", Socket.id);
    })
})


export { io, app, server}; 