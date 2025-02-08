"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSaveShortcut } from "@/services/save-shortcut";
import { useShortcuts } from "@/hooks/use-shortcuts";
import { NewShortcut } from "../../../../../../../../lib/db/schema";

const defaultShortcuts: Omit<NewShortcut, "user_id">[] = [
  { shortcut_name: "Weather", settings: { location: "" }, is_enabled: true },
  { shortcut_name: "Bday", settings: { message: "" }, is_enabled: true },
];

const Shortcuts = () => {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [currentConfig, setCurrentConfig] = useState<string>("");
  const [shortcuts, setShortcuts] = useState(defaultShortcuts);
  const { mutate: saveShortcut, isPending: isSavingShortcut, error: saveShortcutError } = useSaveShortcut();

  const { data: fetchedShortcuts, isLoading: isShortcutsLoading, error: shortcutsError } = useShortcuts();

  useEffect(() => {
    if (fetchedShortcuts) {
      const mergedShortcuts = defaultShortcuts.map((defaultShortcut) => {
        const existingShortcut = fetchedShortcuts.find(
          (shortcut) => shortcut.shortcut_name === defaultShortcut.shortcut_name
        );
        return existingShortcut || defaultShortcut;
      });
      setShortcuts(mergedShortcuts);
    }
  }, [fetchedShortcuts]);

  const openConfigModal = (configType: string) => {
    setCurrentConfig(configType);
    setIsConfigModalOpen(true);
  };

  const handleSwitchChange = (type: string, active: boolean) => {
    const updatedShortcuts = shortcuts.map((shortcut) =>
      shortcut.shortcut_name === type ? { ...shortcut, is_enabled: active } : shortcut
    );
    setShortcuts(updatedShortcuts);
    saveShortcut({ shortcutName: type, updates: { is_enabled: active } });
  };

  const handleConfigChange = (type: string, config: any) => {
    const updatedShortcuts = shortcuts.map((shortcut) =>
      shortcut.shortcut_name === type ? { ...shortcut, settings: config } : shortcut
    );
    setShortcuts(updatedShortcuts);
    saveShortcut({ shortcutName: type, updates: { settings: config } });
  };

  return (
    <div className="w-full flex flex-col border border-gray-300 p-6 rounded-lg shadow-md bg-white">
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Shortcuts</h2>
      </div>

      {shortcuts.map((shortcut) => (
        <div key={shortcut.shortcut_name} className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <Switch
              checked={shortcut.is_enabled}
              onCheckedChange={() => handleSwitchChange(shortcut.shortcut_name, !shortcut.is_enabled)}
            />
            <span className="ml-2 text-gray-800 cursor-pointer" onClick={() => openConfigModal(shortcut.shortcut_name)}>
              {shortcut.shortcut_name}
            </span>
          </div>
        </div>
      ))}

      {shortcutsError && <p className="text-red-500 text-sm mt-2">{shortcutsError.message}</p>}

      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Configure {currentConfig}</h2>
          {currentConfig === "Weather" && (

            <Input
              value={shortcuts.find((s) => s.shortcut_name === "Weather")?.settings?.location || ""}
              placeholder="Type location"
              onChange={(e) =>
                handleConfigChange("Weather", { location: e.target.value })
              }
              className="mt-1 block w-full"
            />
          )}
          {currentConfig === "Bday" && (
            <Input
              value={shortcuts.find((s) => s.shortcut_name === "Bday")?.settings?.message || ""}
              placeholder="Type birthday message"
              onChange={(e) =>
                handleConfigChange("Bday", { message: e.target.value })
              }
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
