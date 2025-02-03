"use client";
import { useState } from "react";
import { ShortcutSelector } from "./ShortcutSelector";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSaveWeatherShortcut } from "@/hooks/useSaveWeatherShortcut";

const Shortcuts = () => {
  const [shortcut, setShortcut] = useState("Weather");
  const [weatherLocation, setWeatherLocation] = useState<string>("");
  const [bdayMessage, setBdayMessage] = useState<string>("");
  const [isWeatherActive, setIsWeatherActive] = useState<boolean>(true);
  const [isBdayActive, setIsBdayActive] = useState<boolean>(true);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [currentConfig, setCurrentConfig] = useState<string>("");

  const userId = "user_2roH7uYsYk5m4ORVmNkCw7KLqrh";
  const { save, isLoading, error } = useSaveWeatherShortcut(
    userId,
    weatherLocation
  );

  const openConfigModal = (configType: string) => {
    setCurrentConfig(configType);
    setIsConfigModalOpen(true);
  };

  return (
    <div className="w-full flex flex-col border border-gray-300 p-6 rounded-lg shadow-md bg-white">
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Shortcuts</h2>
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="flex items-center">
          <Switch checked={isWeatherActive} onChange={setIsWeatherActive} />
          <span className="ml-2 text-gray-800 cursor-pointer" onClick={() => openConfigModal("Weather")}>
            Weather
          </span>
        </div>
        <Button onClick={save} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="flex items-center">
          <Switch checked={isBdayActive} onChange={setIsBdayActive} />
          <span className="ml-2 text-gray-800 cursor-pointer" onClick={() => openConfigModal("Bday")}>
            Birthday
          </span>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Configure {currentConfig}</h2>
          {currentConfig === "Weather" && (
            <Input
              value={weatherLocation}
              placeholder="Type location"
              onChange={(e) => setWeatherLocation(e.target.value)}
              className="mt-1 block w-full"
            />
          )}
          {currentConfig === "Bday" && (
            <Input
              value={bdayMessage}
              placeholder="Type birthday message"
              onChange={(e) => setBdayMessage(e.target.value)}
              className="mt-1 block w-full"
            />
          )}
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsConfigModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shortcuts;
