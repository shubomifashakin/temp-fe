"use client";

export default function Hamburger({
  opened,
  onMenuToggle,
}: {
  opened: boolean;
  onMenuToggle: () => void;
}) {
  return (
    <button
      onClick={onMenuToggle}
      aria-label="Toggle menu"
      className="md:hidden cursor-pointer group  flex flex-col gap-1.5 p-2"
    >
      <div
        className={`w-6 h-0.5 bg-foreground group-hover:bg-orange-500 transition-all ${
          opened ? "rotate-45 translate-y-2" : ""
        }`}
      ></div>
      <div
        className={`w-6 h-0.5 bg-foreground group-hover:bg-orange-500 transition-all ${
          opened ? "opacity-0" : ""
        }`}
      ></div>
      <div
        className={`w-6 h-0.5 bg-foreground group-hover:bg-orange-500 transition-all ${
          opened ? "-rotate-45 -translate-y-2" : ""
        }`}
      ></div>
    </button>
  );
}
