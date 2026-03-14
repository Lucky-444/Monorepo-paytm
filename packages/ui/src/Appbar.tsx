// import { Button } from "./button";

// interface AppbarProps {
//     user?: {
//         name?: string | null;
//     },
//     // TODO: can u figure out what the type should be here?
//     onSignin: any,
//     onSignout: any
// }

// export const Appbar = ({
//     user,
//     onSignin,
//     onSignout
// }: AppbarProps) => {
//     return <div className="flex justify-between border-b px-4">
//         <div className="text-lg flex flex-col justify-center">
//             PayTM
//         </div>
//         <div className="flex flex-col justify-center pt-2">
//             <Button onClick={user ? onSignout : onSignin}>{user ? "Logout" : "Login"}</Button>
//         </div>
//     </div>
// }

"use client";

import { useState } from "react";
import { Button } from "./button";

interface AppbarProps {
  user?: {
    name?: string | null;
  };
  onSignin: () => void;
  onSignout: () => void;
}

export const Appbar = ({ user, onSignin, onSignout }: AppbarProps) => {
  const [open, setOpen] = useState(false);

  const avatar = user?.name
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=guest`;

  return (
    <div className="flex justify-between items-center border-b px-6 py-3 bg-white shadow-sm">
      {/* Logo */}
      <div className="text-xl font-bold text-blue-600">PayTM</div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {!user && <Button onClick={onSignin}>Login</Button>}

        {user && (
          <div className="relative">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <img
                src={avatar}
                alt="avatar"
                className="w-9 h-9 rounded-full border"
              />

              <span className="font-medium text-gray-700">{user.name}</span>
            </div>

            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-white border rounded-lg shadow-lg">
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Dashboard
                </button>

                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Transactions
                </button>

                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Settings
                </button>

                <div className="border-t"></div>

                <button
                  onClick={onSignout}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
