"use client";

import { config, path } from "@/app/path";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { PlayerInterface } from "./Types";

export interface teamInteface {
  _id: string;
  teamName: string;
  players: PlayerInterface[];
}

export default function Page() {
  const [teams, setTeams] = useState<teamInteface[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedBattingTeam, setSelectedBattingTeam] = useState<teamInteface | null>(null);
  const [selectedBowlingTeam, setSelectedBowlingTeam] = useState<teamInteface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${path}/teams`, config);
        if (response.data && Array.isArray(response.data)) {
          setTeams(response.data);
        } else {
          throw new Error("Invalid response data");
        }
      } catch (err) {
        setError("Failed to fetch teams. Please try again.");
        toast.error("Failed to load teams");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleBattingTeam = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTeam = teams.find((team) => team._id === event.target.value);
    setSelectedBattingTeam(selectedTeam || null);
  };

  const handleBowlingTeam = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTeam = teams.find((team) => team._id === event.target.value);
    setSelectedBowlingTeam(selectedTeam || null);
  };

  const handleInningStart = async () => {
    if (!selectedBattingTeam || !selectedBowlingTeam) {
      toast.error("Please select both teams");
      return;
    }
    const matchStart = await axios.post(
      `${path}/start-match`,
      { battingTeam: selectedBattingTeam, bowlingTeam: selectedBowlingTeam },
      config
    );

    const queryParams = new URLSearchParams({
      matchId: matchStart.data._id,
    });
    router.push(`/innings?${queryParams.toString()}`);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${path}/admin`, { username, password }, config);
      if (response.data.login) {
        setLoggedIn(true);
        toast.success("Login successful");
      } else {
        toast.error("Invalid username or password");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading teams...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return loggedIn ? (
    <div className="flex justify-center items-center h-screen">
      <Toaster richColors position="bottom-center" />
      <div className="text-center p-6 border rounded-md shadow-md w-1/3">
        <div className="text-2xl font-semibold mb-4">Select Team</div>
        <div className="flex gap-2">
          <div className="flex flex-col w-full mb-4">
            <label htmlFor="battingTeam">Batting Team</label>
            <select
              onChange={handleBattingTeam}
              className="border p-2 rounded-md"
              id="battingTeam"
              value={selectedBattingTeam?._id || ""}
            >
              <option value="">Select Batting Team</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.teamName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full mb-4">
            <label htmlFor="bowlingTeam">Bowling Team</label>
            <select
              onChange={handleBowlingTeam}
              className="border p-2 rounded-md"
              id="bowlingTeam"
              value={selectedBowlingTeam?._id || ""}
            >
              <option value="">Select Bowling Team</option>
              {teams
                .filter((team) => team._id !== selectedBattingTeam?._id)
                .map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.teamName}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleInningStart}
          className="bg-blue-600 text-white border rounded-md p-2"
        >
          Start Match
        </button>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <Toaster richColors position="bottom-center" />
      <div className="text-center p-6 border rounded-md shadow-md w-1/3">
        <div className="text-2xl font-semibold mb-4">Login</div>
        <div className="flex flex-col mb-4">
          <label htmlFor="username">Admin</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded-md focus-within:ring ring-blue-400 outline-none"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded-md focus-within:ring ring-blue-400 outline-none"
          />
        </div>
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white border rounded-md p-2 w-full"
        >
          Login
        </button>
      </div>
    </div>
  );
}
