"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = require("mongoose");
const todoRoutes_1 = __importDefault(require("./routes/todoRoutes"));
const allowedOrigins = ['*'];
const options = {
    origin: '*'
};
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.port || 3001;
const mongoConnectionString = (_a = process.env.mongodburi) === null || _a === void 0 ? void 0 : _a.toString();
const apiVersion = process.env.api_version || "V1";
// Middleware
app.use((0, cors_1.default)(options));
//Socket Server
// const socketServer = http.createServer(app)
// const io = new Server(socketServer, 
//   { cors:{
//     origin:"*", 
//     methods:["GET","POST"] 
//   }
// })
// export const SocketServer = (socket: Socket) => {
//   socket.on('joinRoom', (id: string) => {
//     socket.join(id)
//     // console.log({ joinRoom: (socket as any).adapter.rooms })
//   })
//   socket.on('outRoom', (id: string) => {
//     socket.leave(id)
//     // console.log({ outRoom: (socket as any).adapter.rooms })
//   })
//   socket.on('disconnect', () =>{
//     console.log(socket.id + ' disconnected')
//   })
// }
// io.on("connection", (socket: Socket) => {
//   SocketServer(socket)
// })
// io.on("connection", (socket) => {
//   console.log("socket connection", socket)
//   socket.on('newItem', (id: string) => {
//     socket.join(id)
//     // console.log({ joinRoom: (socket as any).adapter.rooms })
//   })
//   socket.on('completedItem', (id: string) => {
//     socket.leave(id)
//     // console.log({ outRoom: (socket as any).adapter.rooms })
//   })
//   socket.on('disconnect', () =>{
//     console.log(socket.id + ' disconnected')
//   })
//   socket.on("disconnect", ()=>{
//     console.log("client disconnected")
//   })
// })
// Connect to MongoDB Atlas
(0, mongoose_1.connect)(`${mongoConnectionString}`, {})
    .then(() => console.log('Connected to MongoDB Database'))
    .catch((err) => console.error('Error connecting to MongoDB Atlas:', err.message));
app.use(express_1.default.json());
// Routes
app.use(`/api/${apiVersion}/todo`, todoRoutes_1.default);
app.listen(port, () => {
    console.log(`Server is running API ${apiVersion} on port ${port}`);
});
