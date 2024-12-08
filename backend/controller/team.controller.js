import teamModel from "../models/team.models.js";
import playerModel from "../models/player.models.js";
import adminModel from "../models/admin.models.js";
import bcryptjs from "bcryptjs";

export const getTeam = async (req, res) => {
  try {
    const teamName = req.params.id;
    const teamDB = await teamModel.findOne({ teamName });
    if (!teamDB) return res.status(404).json({ message: "Team not found" });
    return res.json(teamDB);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getTeams = async (req, res) => { 
  try {
    const teamsDB = await teamModel.find().populate({path: "players", select: "name"});
    return res.json(teamsDB);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const createTeam = async (req, res) => {
  try {
    const { teamName, players, teamFlag } = req.body;
    const teamDB = await teamModel.create({ teamName, teamFlag });
    if (!teamDB) return res.status(404).json({ message: "Team was not created"});
    for (const player of players) {
      const playerDb = await playerModel.findOne({ name: player });
      if (!playerDb)
        return res.status(404).json({ message: "Player not found" });
      teamDB.players.push(playerDb._id);
      await teamDB.save();
    }
    return res.json(teamDB);
  } catch (error) {
    return res.json({ message: "Server error"})
  }
};

export const createPlayer = async (req, res) => {
  try {
    const { name, role, format } = req.body;
    const playerDb = await playerModel.create({ name, role, format });
    return res.json(playerDb);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createManyPlayers = async (req, res) => {
  try {
    const players = req.body;
    if (!Array.isArray(players)) {
      return res.status(400).json({ message: "Input must be an array" });
    }

    for (let player of players) {
      const { name, role, format } = player;
      if (!name || !role || !format) {
        return res.status(400).json({ message: "Each player must have name, role, and format" });
      }
    }

    const createdPlayers = await playerModel.insertMany(players);
    return res.json(createdPlayers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getPlayer = async (req, res) => {
  try {
    const { playerId } = req.params;
    const playerDb = await playerModel.create({ _id: playerId });
    return res.json(playerDb);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminDb = await adminModel.findOne({ username });
    const passwordCheck = await bcryptjs.compareSync(password, adminDb.password);
    if (!adminDb) return res.status(401).json({ message: "Invalid credentials" });
    if (!passwordCheck) return res.status(404).json({ message: "Authentication failed" }); 
    return res.json({ login: true, message: "Logged in successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const createAdmin = async (req, res) => { 
  try {
    const { username, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 8);
    const adminDb = await adminModel.create({ username, password: hashedPassword });
    return res.json(adminDb);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}