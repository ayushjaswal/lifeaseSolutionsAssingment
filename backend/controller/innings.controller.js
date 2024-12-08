import inning from "../models/innings.models.js";
import matchModel from "../models/match.model.js";
import player from "../models/player.models.js";

export const startInnings = async (req, res) => {
  try {
    const { battingTeam, bowlingTeam, matchId } = req.body;
    const createInnings = await inning.create({ battingTeam, bowlingTeam });
    if (!createInnings)
      return res
        .status(400)
        .json({ message: "There was an error creating inning" });
    if (matchId) {
      const match = await matchModel.findByIdAndUpdate(matchId, {
        innings: createInnings._id,
      });
      if (!match) return res.status(404).json({ message: "Match not found" });
      return res.status(201).json(match);
    }
    const match = await matchModel.create({
      innings: [createInnings._id],
    });
    return res.status(201).json(match);
  } catch (error) {
    console.error(error);
    return res.json({ message: "Server Error: " + error.message });
  }
};

export const getInnings = async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await matchModel.findById(matchId).populate({
      path: "innings",
      options: { sort: { createdAt: -1 } },
      populate: [
        {
          path: "battingTeam",
          populate: {
            path: "players",
            select: "name",
          },
        },
        {
          path: "bowlingTeam",
          populate: {
            path: "players",
            select: "name",
          },
        },
      ],
    });

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    return res.json(match.innings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export const getMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await matchModel.findById(matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });
    return res.json(match);
  } catch (error) {
    console.error(error);
    return res.json({ message: "Server Error: " + error.message });
  }
};

export const singleBall = async (req, res) => {
  try {
    const {
      ballCom,
      runs,
      extras,
      wide,
      byes,
      freeHit,
      legbyes,
      wicket,
      noBall,
      strikerName,
      nonStrikerName,
      bowlerName,
    } = req.body;
    const { inningId } = req.params;
    const innings = await inning.findById(inningId);
    const striker = await player.findOne({ name: strikerName });
    const nonStriker = await player.findOne({ name: nonStrikerName });
    const bowler = await player.findOne({ name: bowlerName });

    const newBallEvent = {
      ballCom,
      runs,
      extras,
      wide,
      freeHit,
      byes,
      legbyes,
      wicket,
      noBall,
      striker,
      nonStriker,
      bowler,
    };

    if (!innings) return res.status(404).json({ message: "Inning not found" });
    innings.ballRun.push(newBallEvent);
    innings.teamScore += extras + runs;
    innings.wickets += wicket;
    innings.overs = Math.floor((innings.ballRun.length + 1) / 6);
    await innings.save();
    return res.json(innings);
  } catch (error) {
    console.error(error);
    return res.json({ message: "Server Error: " + error.message });
  }
};

export const getBatsmanStat = async (req, res) => {
  try {
    const { striker, inningsId } = req.body;
    const innings = await inning.findById(inningsId);

    if (!innings) {
      return res.status(404).json({ message: "Inning not found" });
    }

    const playerBalls = innings.ballRun.filter(
      (ball) => ball.striker.toString() === striker
    );

    return res.json(playerBalls);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export const getBowlerStat = async (req, res) => {
  try {
    const { bowler, inningsId } = req.body;
    const innings = await inning.findById(inningsId);

    if (!innings) {
      return res.status(404).json({ message: "Inning not found" });
    }

    const playerBalls = innings.ballRun.filter(
      (ball) => ball.bowler.toString() === bowler
    );

    return res.json(playerBalls);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error: " + error.message });
  }
};
