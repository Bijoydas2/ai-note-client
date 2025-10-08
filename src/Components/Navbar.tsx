import React from "react";
import { InputText } from "primereact/inputtext";
import { Moon, Sun } from "lucide-react";

type Props = {
  search: string;
  onSearch: (s: string) => void;
  onToggleDark: () => void;
  dark: boolean;
};

export const Navbar: React.FC<Props> = ({ search, onSearch, onToggleDark, dark }) => {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#0b1520] border-b border-[#16202a]">
      <div className="flex items-center gap-3">
        <div className="bg-[#0b3b7a] p-2 rounded-md flex items-center justify-center">
          {/* small brain icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" className="text-white">
            <path fill="white" d="M12 2C13.1 2 14 2.9 14 4 14 4.6 13.7 5.1 13.2 5.4 13.7 5.9 14 6.6 14 7.5 14 9.5 12.2 11 10 11 9 11 8 10.6 7.3 10.1 6.9 10.7 6 11 5 11 3.9 11 3 10.1 3 9 3 7.9 3.9 7 5 7 5.6 7 6.1 7.3 6.4 7.8 6 8 6 9.1 6.7 10.2 8.1 11 9 11 10.9 11 12 9.5 12 7.5 12 6.6 12.3 5.9 12.8 5.4 12.3 5.1 12 4.6 12 4 12 2Z"></path>
          </svg>
        </div>
        <div className="text-white font-semibold text-lg">AI Notes</div>
      </div>

      <div className="flex-1 max-w-2xl px-6">
        <span className="p-input-icon-left w-full">
          <i className="pi pi-search text-gray-400"></i>
          <InputText
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full bg-[#0f1724] border-none text-gray-200 px-4"
          />
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* dark toggle */}
        <button
          onClick={onToggleDark}
          className="p-2 rounded-full bg-transparent border border-transparent hover:bg-[#16202a]"
        >
          {dark ? <Sun className="text-white" /> : <Moon className="text-gray-200" />}
        </button>

        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600"></div>
      </div>
    </header>
  );
};
