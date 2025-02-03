"use client";
import { useState } from "react";
import { ShortcutSelector } from "./ShortcutSelector";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSaveWeatherShortcut } from "@/hooks/useSaveWeatherShortcut";

const Shortcuts = () => {
  const [shortcut, setShortcut] = useState("Weather");
  const [weatherLocation, setWeatherLocation] = useState<string>("");

  const userId = "user_2roH7uYsYk5m4ORVmNkCw7KLqrh";
  const { save, isLoading, error } = useSaveWeatherShortcut(
    userId,
    weatherLocation
  );
  return (
    <div className="w-full flex flex-col border-2 border-gray-200 p-5">
      <div className="flex pb-10 justify-between gap-2">
        <p className="text-2xl">Shortcuts</p>
        <Button onClick={save} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
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
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Shortcuts;
