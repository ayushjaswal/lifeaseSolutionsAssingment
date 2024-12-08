"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import socketService from "@/app/socket";
import { path, config } from "@/app/path";
import axios from "axios";
import swap from "@/app/assets/swap.png";
import Image from "next/image";
import MatchButtons from "../components/MatchButtons";
import { Inning, newBallInterace, PlayerInterface, PlayerStat } from "../Types";
import { toast } from "sonner";

export default function Home() {
  const params = useSearchParams();
  const router = useRouter();
  const [battingTeam, setBattingTeam] = useState<PlayerInterface[]>([]);
  const [bowlingTeam, setBowlingTeam] = useState<PlayerInterface[]>([]);
  const [currentInning, setCurrentInning] = useState<number>(1);
  const [match, setMatch] = useState([]);
  const [innings, setInnings] = useState<Inning>();
  const [commString, setCommString] = useState<string[]>([]);
  const [wicket, setWicket] = useState(0);
  const [striker, setStriker] = useState<PlayerInterface | null>(null);
  const [score, setScore] = useState(0);
  const [nonStriker, setNonStriker] = useState<PlayerInterface | null>(null);
  const [bowler, setBowler] = useState<PlayerInterface | null>(null);
  const [muted, setMuted] = useState(false);
  const [over, setOver] = useState(0);
  const [balls, setBalls] = useState(0);
  const [batsmanStats, setBatsmanStats] = useState<PlayerStat[]>([]);
  const [bowlerStats, setBowlerStats] = useState<PlayerStat[]>([]);
  const scrolldiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const getInnings = async () => {
      const response = await axios.get(
        `${path}/match-innings/${params.get("matchId")}`,
        config
      );
      if (response.data) {
        const inningData = response.data[0];
        setInnings(inningData);
        setMatch(response.data);
        setScore(inningData.teamScore);
        setWicket(inningData.wickets);
        setBalls(inningData?.ballRun?.length % 6 || 0);
        setOver(inningData.overs);
        setBattingTeam(inningData.battingTeam.players);
        setBowlingTeam(inningData.bowlingTeam.players);
        setStriker(inningData.battingTeam.players[0]);
        setNonStriker(inningData.battingTeam.players[1]);
        setBowler(inningData.bowlingTeam.players[0]);
        const commentary = inningData?.ballRun?.map((element: any) => {
          return element.ballCom;
        });
        setCommString(commentary || []);
      }
    };
    getInnings();
  }, [params]);

  useEffect(() => {
    socketService.connect(path);
    socketService.on("new-ball", (newBall: newBallInterace) => {
      setCommString((prev) => [...prev, newBall.eventString]);
      setScore((prev) => prev + newBall.score);
      if (newBall.wicket) {
        setWicket((prev) => prev + 1);
      }
      setBatsmanStats(prev => [...prev, {runs: newBall.score }])
      setBowlerStats(prev => [...prev, {runs: newBall.score }])
      updateOversAndBalls();
    });
    return () => socketService.disconnect();
  }, []);

  useEffect(() => {
    if (scrolldiv.current) {
      scrolldiv.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [commString]);


  useEffect(() => {
    const getPlayersStat = async () => {
      try {
        const getBatsmanStat = await axios.post(
          `${path}/getBatsmanStat`,
          {
            striker: striker!._id,
            inningsId: innings?._id,
          },
          config
        );
        const getBowlerStat = await axios.post(
          `${path}/getBowlerStat`,
          {
            bowler: bowler!._id,
            inningsId: innings?._id,
          },
          config
        );
        if (!getBatsmanStat) {
          toast.error("Failed to get batsman stat");
        }
        if (!getBowlerStat) {
          toast.error("Failed to get bowler stat");
        }

        setBatsmanStats(getBatsmanStat.data);
        setBowlerStats(getBowlerStat.data);
      } catch (error: any) {
        console.log(error);
        // toast.error(error.message);
      }
    };
    getPlayersStat();
  }, [bowler, striker]);

  const updateOversAndBalls = () => {
    setBalls((prevBalls) => {
      const newBalls = prevBalls + 1;
      if (newBalls === 6) {
        setOver((prevOver) => prevOver + 1);
        return 0;
      }
      return newBalls;
    });
  };

  const handleStrikeSwap = () => {
    setStriker(nonStriker);
    setNonStriker(striker);
  };

  const handleStrikerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPlayer = battingTeam.find(
      (player) => player.name === event.target.value
    );
    if (selectedPlayer) setStriker(selectedPlayer);
  };

  const handleNonStrikerChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedPlayer = battingTeam.find(
      (player) => player.name === event.target.value
    );
    if (selectedPlayer) setNonStriker(selectedPlayer);
  };

  const handleBowlerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPlayer = bowlingTeam.find(
      (player) => player.name === event.target.value
    );
    if (selectedPlayer) setBowler(selectedPlayer);
  };

  const toggleMuted = () => {
    setMuted((prev) => !prev);
  };

  return (
    <div className="flex m-2 gap-2 ">
      <div className="flex flex-col gap-2 w-2/3 border p-2 rounded-md ">
        {battingTeam.length > 0 && bowlingTeam.length > 0 ? (
          <>
            <div className="flex gap-2 items-center ">
              <div className="flex flex-col w-full">
                <label htmlFor="batsman-striker">Batsman (Striker)</label>
                <select
                  id="batsman-striker"
                  value={striker?.name || ""}
                  className="border focus-within:outline-none p-2 rounded-md"
                  onChange={handleStrikerChange}
                >
                  {battingTeam.map((player) => (
                    <option value={player.name} key={player.name}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>

              <Image
                onClick={handleStrikeSwap}
                className="cursor-pointer"
                src={swap}
                alt="swap"
                width={24}
                height={24}
              />

              <div className="flex flex-col w-full">
                <label htmlFor="batsman-non-striker">
                  Batsman (Non-Striker)
                </label>
                <select
                  id="batsman-non-striker"
                  value={nonStriker?.name || ""}
                  className="border focus-within:outline-none p-2 rounded-md"
                  onChange={handleNonStrikerChange}
                >
                  {battingTeam.map((player) => (
                    <option value={player.name} key={player.name}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col w-full">
                <label htmlFor="bowler">Bowler</label>
                <select
                  id="bowler"
                  value={bowler?.name || ""}
                  className="border focus-within:outline-none p-2 rounded-md"
                  onChange={handleBowlerChange}
                >
                  {bowlingTeam.map((player) => (
                    <option value={player.name} key={player.name}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        ) : (
          <div>Loading match details...</div>
        )}

        <div className="font-semibold">
          Score: {score}/{wicket}
        </div>
        <div className="font-semibold">
          Overs: {over}.{balls}
        </div>
        <button
          onClick={toggleMuted}
          className={`p-2 rounded border transition ${
            muted ? "bg-blue-600 text-white" : "hover:bg-gray-100"
          }`}
        >
          {muted ? "Mute-voice/Text-off" : "Unmute-voice/Text-on"}
        </button>
        <MatchButtons
          inningId={innings?._id || ""}
          bowler={bowler?.name || ""}
          striker={striker?.name || ""}
          nonStriker={nonStriker?.name || ""}
        />
      </div>

      <div className=" px-4 w-1/3 border rounded-md flex flex-col gap-2">
        <div className="text-lg font-bold  py-2">Scorecard</div>
        <button
          onClick={() => router.push(`/score/${innings?._id}`)}
          className="p-2 bg-gray-100 w-full rounded-md text-right text-blue-500 font-semibold "
        >
          View Full Score Card
        </button>

        <div className="border rounded-md p-2">
          <div className="flex justify-between ">
            <div className="bg-gray-100 p-2 w-[48%] flex flex-col items-center rounded-md border">
              <div className="font-semibold">
                {innings?.battingTeam.teamName}
              </div>
              <img
                src={innings?.battingTeam.teamFlag}
                alt="Batting Team Flag"
                className="w-14 h-14 rounded-full border "
              />
              <div className="text-xl font-bold">
                {score}/{wicket}
              </div>
            </div>
            <div className="bg-gray-100 p-2 w-[48%] flex flex-col items-center rounded-md border">
              <div className="font-semibold">
                {innings?.bowlingTeam.teamName}
              </div>
              <img
                src={innings?.bowlingTeam.teamFlag}
                alt="Bowling Team Flag"
                className="w-14 h-14 rounded-full border"
              />
              <div className="text-xl font-bold">
                {match.length === 1 ? "Yet to bat" : null}
              </div>
            </div>
          </div>
          <div className="text-gray-500 ">
            {over}.{balls} Overs
          </div>

          <div className="rounded-t-md border ">
            <div className="flex justify-between bg-gray-100 rounded-t-md p-3 border-b">
              <h2 className="font-semibold text-lg text-gray-700">
                Batsman Stats
              </h2>
              <div>Runs last six balls</div>
            </div>
            <div className="flex p-4 space-y-3 justify-between items-center">
              <div className="text-gray-800 font-medium text-md">
                {striker?.name || "N/A"}
              </div>

              <div className="flex gap-4">
                {batsmanStats.slice(-6).map((stats: any, key) => (
                  <div key={key} className="flex items-center justify-center ">
                    <span className="text-sm font-semibold">{stats.runs}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-t-md border mt-2">
            <div className="flex justify-between bg-gray-100 rounded-t-md p-3 border-b">
              <h2 className="font-semibold text-lg text-gray-700">
                Bowler Stats
              </h2>
              <div>Runs last six balls</div>
            </div>
            <div className="flex p-4 space-y-3 justify-between items-center">
              <div className="text-gray-800 font-medium text-md">
                {bowler?.name || "N/A"}
              </div>
              <div className="flex gap-4">
                {bowlerStats.slice(-6).map((stats: any, key) => (
                  <div key={key} className="flex items-center justify-center ">
                    <span className="text-sm font-semibold">{stats.runs}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div>Live updates...</div>
            <div className="border rounded-md p-4 h-[15rem] flex flex-col gap-2  overflow-y-scroll ">
              {commString.map((comment, index) => (
                <div key={index} className="text-sm bg-gray-100 p-2 rounded-md">
                  {comment}
                </div>
              ))}
              <div ref={scrolldiv} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
