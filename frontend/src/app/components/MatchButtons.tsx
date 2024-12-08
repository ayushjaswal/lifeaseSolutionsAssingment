import React, { useEffect, useState } from "react";
import Button from "./Button";
import socketService from "../socket";
import { config, path } from "../path";
import axios from "axios";
import { toast, Toaster } from "sonner";

interface MatchButtonProps {
  bowler: string;
  striker: string;
  nonStriker: string;
  inningId: string;
}

const MatchButtons = ({
  bowler,
  striker,
  nonStriker,
  inningId,
}: MatchButtonProps) => {
  const [eventString, setEventString] = useState("");
  const [run, setRun] = useState(0);
  const [extras, setExtras] = useState(0);
  const [wides, setWides] = useState(false);
  const [byes, setByes] = useState(false);
  const [legbyes, setLegbyes] = useState(false);
  const [wicket, setWicket] = useState(false);
  const [noBall, setNoBall] = useState(false);

  const handleNewDevelopment = async (text: string) => {
    let ballCom = "";

    switch (text) {
      case "Ball Start":
        setEventString(`${bowler} to ${striker}:`);
        break;

      case "Wide":
        setEventString((prev) => prev + " Wide.");
        setExtras((prev) => prev + 1);
        setWides(true);
        break;

      case "No Ball":
        setEventString((prev) => prev + " No Ball.");
        setNoBall(true);
        break;

      case "Wicket":
        setEventString((prev) => prev + " Wicket.");
        setWicket(true);
        break;

      case "Leg Bye":
        setEventString((prev) => prev + " Leg Bye.");
        setLegbyes(true);
        setExtras((prev) => prev + 1);
        break;

      case "Bye":
        setEventString((prev) => prev + " Bye.");
        setByes(true);
        break;

      case "Done":
        const data = {
          ballCom: eventString,
          runs: run,
          extras,
          wide: wides,
          byes,
          legbyes,
          wicket,
          noBall,
          bowlerName: bowler,
          strikerName: striker,
          nonStrikerName: nonStriker,
        };
        socketService.emit("ball", { eventString, score: extras + run, wicket });
        const newBall = await axios.post(
          `${path}/match/${inningId}`,
          data,
          config
        );
        if (!newBall.data) {
          toast.error("Error adding new ball");
        }
        setEventString("");
        setRun(0);
        setExtras(0);
        setWides(false);
        setByes(false);
        setLegbyes(false);
        setWicket(false);
        setNoBall(false);
        break;

      default:
        if (!isNaN(Number(text))) {
          setEventString(
            (prev) => prev + `${text} ${Number(text) > 1 ? "runs" : " run"}.`
          );
          setRun(Number(text));
        } else {
          ballCom = `Unknown event: ${text}`;
        }
        break;
    }

    // Set the current event string
    setEventString((prev) => `${prev} ${ballCom}`);
  };
  useEffect(() => {
    socketService.connect(path);
    return () => socketService.disconnect();
  }, []);

  return (
    <div>
      <div className="p-2 flex flex-col gap-1 w-full">
        <Toaster richColors position="bottom-center" />
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 w-1/3">
            <Button
              onClick={() => handleNewDevelopment("Ball Start")}
              className="bg-green-700"
              text="Ball Start"
            />
            <Button
              onClick={() => handleNewDevelopment("Wide")}
              className="bg-yellow-700"
              text="Wide"
            />
            <Button
              onClick={() => handleNewDevelopment("No Ball")}
              className="bg-blue-950"
              text="No Ball"
            />
          </div>
          <div className="grid grid-cols-3 gap-1 w-full">
            <Button
              onClick={() => handleNewDevelopment("0")}
              className="bg-blue-700"
              text="0"
            />
            <Button
              onClick={() => handleNewDevelopment("1")}
              className="bg-blue-950"
              text="1"
            />
            <Button
              onClick={() => handleNewDevelopment("Wicket")}
              className="bg-red-700"
              text="Wicket"
            />
            <Button
              onClick={() => handleNewDevelopment("2")}
              className="bg-teal-700"
              text="2"
            />
            <Button
              onClick={() => handleNewDevelopment("4")}
              className="bg-green-300"
              text="4"
            />
            <Button
              onClick={() => handleNewDevelopment("6")}
              className="bg-gray-400"
              text="6"
            />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-1 w-full">
          <Button
            onClick={() => handleNewDevelopment("Bowler stop")}
            className="bg-purple-800"
            text="Bowler stop"
          />
          <Button
            onClick={() => handleNewDevelopment("1 or 2")}
            className="bg-blue-950"
            text="1 or 2"
          />
          <Button
            onClick={() => handleNewDevelopment("2 or 4")}
            className="bg-purple-800"
            text="2 or 4"
          />
          <Button
            onClick={() => handleNewDevelopment("4 or 6")}
            className="bg-yellow-800"
            text="4 or 6"
          />
          <Button
            onClick={() => handleNewDevelopment("Ball In Air")}
            className="bg-purple-800"
            text="Ball In Air"
          />
          <Button
            onClick={() => handleNewDevelopment("Others")}
            className="bg-blue-950"
            text="Others"
          />
          <Button
            onClick={() => handleNewDevelopment("3")}
            className="bg-purple-800"
            text="3"
          />
          <Button
            onClick={() => handleNewDevelopment("Boundary Check")}
            className="bg-blue-800"
            text="Boundary Check"
          />
          <Button
            onClick={() => handleNewDevelopment("Apeal")}
            className="bg-[#799C9D]"
            text="Apeal"
          />
          <Button
            onClick={() => handleNewDevelopment("Catch Drop")}
            className="bg-blue-950"
            text="Catch Drop"
          />
        </div>
        <div className="grid grid-cols-4 gap-1 w-full">
          <Button
            onClick={() => handleNewDevelopment("Leg Bye")}
            className="bg-blue-500"
            text="Leg Bye"
          />
          <Button
            onClick={() => handleNewDevelopment("Bye")}
            className="bg-green-600"
            text="Bye"
          />
          <Button
            onClick={() => handleNewDevelopment("Third Umpire")}
            className="bg-[#799C9D]"
            text="Third Umpire"
          />
          <Button
            onClick={() => handleNewDevelopment("Review")}
            className="bg-red-700"
            text="Review"
          />
          <Button
            onClick={() => handleNewDevelopment("Done")}
            className="bg-green-800"
            text="Done"
          />
          <Button
            onClick={() => handleNewDevelopment("Misfield")}
            className="bg-blue-950"
            text="Misfield"
          />
          <Button
            onClick={() => handleNewDevelopment("Overthrow")}
            className="bg-purple-700"
            text="Overthrow"
          />
          <Button
            onClick={() => handleNewDevelopment("Wicket Confirm")}
            className="bg-red-700"
            text="Wicket Confirm"
          />
        </div>
      </div>
    </div>
  );
};

export default MatchButtons;
