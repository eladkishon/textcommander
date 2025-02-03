interface GameTimerSelectorProps {
  shortcut: string;
  setShortcut: (value: string) => void;
}

export const ShortcutSelector = ({
  shortcut,
  setShortcut,
}: GameTimerSelectorProps) => {
  const options = [
    { value: "Weather", label: "Weather" },
    { value: "Bday", label: "Bday" },
  ];

  return (
    <div className="w-full flex space-x-12">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setShortcut(option.value)}
          className={`
                relative z-10 w-40 rounded-lg text-black
                ${shortcut === option.value && "bg-primary"}
              `}
        >
          {option.label}
        </button>
      ))}
      {/* Sliding background */}
      <div
        className="absolute inset-y-1 transition-all duration-300 bg-primary-blue rounded-full"
        style={{
          [document.dir === "rtl" ? "right" : "left"]:
            `${(options.findIndex((opt) => opt.value === shortcut) * 100) / options.length + 1}%`,
          width: `${93 / options.length}%`,
        }}
      />
    </div>
  );
};
