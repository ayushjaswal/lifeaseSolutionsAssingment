import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import http from "http";
import connect from "./utils/db.js";
import { getTeam, createTeam, createPlayer, getPlayer, loginAdmin, createAdmin, createManyPlayers, getTeams} from "./controller/team.controller.js"
import cors from "cors";
import { getBowlerStat, getBatsmanStat, getInnings, getMatch, singleBall, startInnings } from "./controller/innings.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;


app.use(express.json());
connect();
const corsOptions = {
  credentials: true,
  origin: process.env.CLIENT,
};
console.log(corsOptions);
app.use(cors(corsOptions));
const server = http.createServer(app);
const io = new Server(server, { cors: { ...corsOptions } });

app.get("/team/:teamName", getTeam);
app.get("/teams", getTeams)
app.post("/team", createTeam);
app.post("/player", createPlayer);
app.post("/player/createMany", createManyPlayers)
app.get("/player/:playerId", getPlayer);
app.post("/admin", loginAdmin);
app.post("/admin/create", createAdmin)
app.post("/start-match", startInnings)
app.get("/match-innings/:matchId", getInnings);
app.get("/match/:matchId", getMatch)
app.post("/match/:inningId", singleBall)
app.post("/getBatsmanStat", getBatsmanStat)
app.post("/getBowlerStat", getBowlerStat)

io.on("connection", (socket) => {
  socket.on("ball", (data)=>{
    console.log(data)
    socket.emit("new-ball", data);
  })
})
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})