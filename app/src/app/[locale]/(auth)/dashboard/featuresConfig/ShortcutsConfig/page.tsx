import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ShortcutsConfig = () => {
  const onSave = () => {
    
  };
  return (
    <div>
      <p className="text-2xl pb-5">Shortcuts</p>
      <span>
        <h4>Weather</h4>
        <Input placeholder="write location" />
      </span>
      <Button onClick={onSave}>Save</Button>
    </div>
  );
};

export default ShortcutsConfig;
