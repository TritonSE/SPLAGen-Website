// import LanguageSwitcher from "./components/languageSwitcher";
// import External from "./components/translationDemo";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center min-h-screen">
//       <main className="flex flex-col gap-8 row-start-2 items-center">
//         {/* Added the LanguageSwitcher component */}
//         <LanguageSwitcher />
//         {/* External is my text component */}
//         <External></External>
//       </main>
//     </div>
//   );
// // }
// import React from "react";

// import Signup from "./signup/page";

// const Page = () => {
//   return (
//     <div>
//       <h1>Signup Page</h1>
//       <Signup />
//     </div>
//   );
// };

// export default Page;

"use client"; // Add this line to mark this file as a client component

import React, { useState } from "react";
import {
  DenyRequestPopup,
  ApproveRequestPopup,
  InviteAdminPopup,
  RemoveAdminPopup,
} from "./components/flowPopups";

type PopupType = "deny" | "approve" | "invite" | "remove" | null;

const Page = () => {
  const [activePopup, setActivePopup] = useState<PopupType>(null);

  const user = { name: "Nancy Liu", email: "n6liu@ucsd.edu" };

  const renderPopup = () => {
    switch (activePopup) {
      case "deny":
        return (
          <DenyRequestPopup
            user={user}
            onCancel={() => setActivePopup(null)}
            onConfirm={() => alert("Denied!")}
          />
        );
      case "approve":
        return (
          <ApproveRequestPopup
            user={user}
            onCancel={() => setActivePopup(null)}
            onConfirm={() => alert("Approved!")}
          />
        );
      case "invite":
        return (
          <InviteAdminPopup
            user={user}
            onCancel={() => setActivePopup(null)}
            onConfirm={() => alert("Invited!")}
          />
        );
      case "remove":
        return (
          <RemoveAdminPopup
            user={user}
            onCancel={() => setActivePopup(null)}
            onConfirm={() => alert("Removed!")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1>Popup Demo</h1>
      <button
        onClick={() => setActivePopup("deny")}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Show Deny Request Popup
      </button>
      <button
        onClick={() => setActivePopup("approve")}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Show Approve Request Popup
      </button>
      <button
        onClick={() => setActivePopup("invite")}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Show Invite Admin Popup
      </button>
      <button
        onClick={() => setActivePopup("remove")}
        className="px-4 py-2 bg-yellow-500 text-black rounded"
      >
        Show Remove Admin Popup
      </button>

      {renderPopup()}
    </div>
  );
};

export default Page;
