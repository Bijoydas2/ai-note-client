import React, { useContext, useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Brain, Moon, Search, Sun, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "primereact/button";
import { AuthContext } from "../Context/AuthProvider";
import { toast } from "react-toastify";

type Props = {
  search: string;
  onSearch: (s: string) => void;
  onToggleDark: () => void;
  dark: boolean;
};

export const Navbar: React.FC<Props> = ({ search, onSearch, onToggleDark, dark }) => {
  const navigate = useNavigate();
  const { user, logOut } = useContext(AuthContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
  try {
    await logOut();
    toast.success("Logged out successfully!");
    navigate("/login");
  } catch (err: any) {
    toast.error(err.message || "Logout failed");
  }
};


  return (
    <header className="flex  md:flex-row md:items-center md:justify-between px-4 md:px-6 py-3 bg-[#0b1520] border-b border-[#16202a] gap-3 md:gap-0">
      {/* Left: Logo */}
      <div className="flex items-center w-full md:w-auto">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-[#0b3b7a] p-2 rounded-md flex items-center justify-center">
            <Brain className="h-4 w-4 md:w-6 md:h-6 lg:w-6 lg:h-6 text-white" />
          </div>
          <span className="text-white font-bold text-sm lg:text-xl md:text-xl">AI Notes</span>
        </Link>
      </div>
     {/* center */}
      <div className="w-full md:max-w-lg  mt-2 md:mt-0">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <InputText
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full bg-[#0f1724] border-none text-gray-200 px-10 py-2 rounded-md"
          />
        </div>
      </div>

      {/* Right: Profile/Login */}
      <div className="flex items-center justify-end gap-3 w-full md:w-auto mt-2 md:mt-0 relative">
        
        <button
          onClick={onToggleDark}
          className="p-2 rounded-full bg-transparent border border-transparent hover:bg-[#16202a]"
        >
          {dark ? <Sun className="text-white" /> : <Moon className="text-gray-200" />}
        </button>

        
        {!user ? (
          <Link to="/login">
            <Button
              label="Login"
              icon={<User className="w-4 h-4 mr-2" />}
              className="bg-[#0b3b7a] hover:bg-[#0a3365] border-none text-white px-3 py-2 rounded-md flex items-center gap-2"
            />
          </Link>
        ) : (
          <div className="relative" ref={dropdownRef}>
           
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center focus:outline-none"
            >
              <User className="w-5 h-5 text-gray-800 dark:text-gray-200" />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#101b29] shadow-lg rounded-md border border-[#16202a] z-50">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-white font-semibold">{user.displayName || "User"}</p>
                  <p className="text-gray-400 text-sm truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-[#0b3b7a] text-white flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
