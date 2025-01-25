"use client";
import { useState } from "react";
import { ShortcutSelector } from "./ShortcutSelector";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

const Shortcuts = () => {
  const [shortcut, setShortcut] = useState("Weather");
  const [weatherLocation, setWeatherLocation] = useState<string>("");
  const userId = "user_2roH7uYsYk5m4ORVmNkCw7KLqrh";
  
  const save = async () => {
    try {
      await axios.post(`/api/shortcuts?userId=${userId}`, {
        location: weatherLocation,
      });
      console.log("Saved");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full flex flex-col border-2 border-gray-200 p-5">
      <div className="flex pb-10 justify-between gap-2">
        <p className="text-2xl">Shortcuts</p>
        <Button onClick={save}>Save</Button>
      </div>
      <ShortcutSelector shortcut={shortcut} setShortcut={setShortcut} />
      <div className="pt-8">
        {shortcut === "Weather" && (
          <Input
            value={weatherLocation}
            placeholder="Type location"
            onChange={(e) => setWeatherLocation(e.target.value)}
          />
        )}
      </div>
    </div>
  );
};

export default Shortcuts;
