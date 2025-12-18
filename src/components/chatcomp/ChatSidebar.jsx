/* The provided code is a React component named `ChatSidebar`. It serves as a navigation sidebar for a
chat interface. Here's a breakdown of what the component does: */
// /**
//  * ChatSidebar Component - Navigation sidebar for chat interface
//  *
//  * This component provides navigation between different chat views:
//  * - "My Chats": Shows users with whom the current user has conversations
//  * - "All Users": Shows all registered users for starting new conversations
//  * - Handles user selection and tab switching
//  */

// import React, { useState } from "react";

// function ChatSidebar({ users = [], chats = [], onSelectUser, currentUser }) {
//   // State to track which tab is currently active
//   const [tab, setTab] = useState("my");

//   return (
//     <div className="flex flex-col w-full h-full bg-gray-900 p-4 rounded-xl">
//       {/* Tab Navigation - Switches between My Chats and All Users */}
//       <div className="flex gap-3 mb-4">
//         <button
//           onClick={() => setTab("my")}
//           className={`flex-1 py-2 rounded-xl font-semibold transition ${
//             tab === "my"
//               ? "bg-indigo-600 text-white"
//               : "bg-gray-700 text-gray-300 hover:bg-gray-600"
//           }`}
//         >
//           My Chats
//         </button>
//         <button
//           onClick={() => setTab("all")}
//           className={`flex-1 py-2 rounded-xl font-semibold transition ${
//             tab === "all"
//               ? "bg-indigo-600 text-white"
//               : "bg-gray-700 text-gray-300 hover:bg-gray-600"
//           }`}
//         >
//           All Users
//         </button>
//       </div>

//       {/* Divider line */}
//       <div className="h-[1px] bg-gray-700 mb-3"></div>

//       {/* Scrollable content area */}
//       <div className="flex-1 overflow-y-auto">
//         {tab === "all" ? (
//           /* All Users Tab - Shows all registered users */
//           <>
//             <h3 className="text-lg font-bold mb-3 text-white">
//               All Registered Users
//             </h3>
//             {users.length === 0 ? (
//               <p className="text-gray-400 text-sm">No users found.</p>
//             ) : (
//               users.map((user) => (
//                 <button
//                   key={user.uid}
//                   onClick={() => onSelectUser(user)}
//                   className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition text-left w-full"
//                 >
//                   <img
//                     src={
//                       user.photoURL ||
//                       `https://ui-avatars.com/api/?name=${
//                         user.displayName || user.email
//                       }&background=random&color=fff&size=40`
//                     }
//                     alt={user.displayName || user.email}
//                     className="w-10 h-10 rounded-full border-2 border-gray-700 object-cover"
//                   />
//                   <div className="flex-1">
//                     <div className="font-semibold text-sm">
//                       {user.displayName || user.email}
//                     </div>
//                     <div className="text-xs text-gray-400">
//                       {user.status === "active" ? "Active" : "Inactive"}
//                     </div>
//                   </div>
//                 </button>
//               ))
//             )}
//           </>
//         ) : (
//           /* My Chats Tab - Shows users with existing conversations */
//           <>
//             <h3 className="text-lg font-bold mb-3 text-white">My Chats</h3>
//             {chats.length === 0 ? (
//               <p className="text-gray-400 text-sm">
//                 You don't have any chats yet. Start a conversation from "All Users".
//               </p>
//             ) : (
//               chats.map((user) => (
//                 <button
//                   key={user.uid}
//                   onClick={() => onSelectUser(user)}
//                   className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition text-left w-full"
//                 >
//                   <img
//                     src={
//                       user.photoURL ||
//                       `https://ui-avatars.com/api/?name=${
//                         user.displayName || user.email
//                       }&background=random&color=fff&size=40`
//                     }
//                     alt={user.displayName || user.email}
//                     className="w-10 h-10 rounded-full border-2 border-gray-700 object-cover"
//                   />
//                   <div className="flex-1">
//                     <div className="font-semibold text-sm">
//                       {user.displayName || user.email}
//                     </div>
//                     <div className="text-xs text-gray-400">
//                       {user.status === "active" ? "Active" : "Inactive"}
//                     </div>
//                   </div>
//                 </button>
//               ))
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ChatSidebar;


/**
 * ChatSidebar Component - Navigation sidebar for chat interface
 *
 * This component provides navigation between different chat views:
 * - "My Chats": Shows users with whom the current user has conversations
 * - "All Users": Shows all registered users for starting new conversations
 * - Handles user selection and tab switching
 */

import React, { useState } from "react";

function ChatSidebar({ users = [], chats = [], onSelectUser, currentUser }) {
  // State to track which tab is currently active
  const [tab, setTab] = useState("my");

  return (
    <div className="flex flex-col w-full h-full bg-gray-900 p-4 rounded-xl">
      {/* Tab Navigation - Switches between My Chats and All Users */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setTab("my")}
          className={`flex-1 py-2 rounded-xl font-semibold transition ${
            tab === "my"
              ? "bg-indigo-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          My Chats
        </button>
        <button
          onClick={() => setTab("all")}
          className={`flex-1 py-2 rounded-xl font-semibold transition ${
            tab === "all"
              ? "bg-indigo-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          All Users
        </button>
      </div>

      {/* Divider line */}
      <div className="h-[1px] bg-gray-700 mb-3"></div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        {tab === "all" ? (
          /* All Users Tab - Shows all registered users */
          <>
            <h3 className="text-lg font-bold mb-3 text-white">
              All Registered Users
            </h3>
            {users.length === 0 ? (
              <p className="text-gray-400 text-sm">No users found.</p>
            ) : (
              users.map((user) => (
                <button
                  key={user.uid}
                  onClick={() => onSelectUser(user)}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition text-left w-full"
                >
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${
                        user.displayName || user.email
                      }&background=random&color=fff&size=40`
                    }
                    alt={user.displayName || user.email}
                    className="w-10 h-10 rounded-full border-2 border-gray-700 object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">
                      {user.displayName || user.email}
                    </div>
                    <div className="text-xs text-gray-400">
                      {user.status === "active" ? "Active" : "Inactive"}
                    </div>
                  </div>
                </button>
              ))
            )}
          </>
        ) : (
          /* My Chats Tab - Shows users with existing conversations */
          <>
            <h3 className="text-lg font-bold mb-3 text-white">My Chats</h3>
            {chats.length === 0 ? (
              <p className="text-gray-400 text-sm">
                You don't have any chats yet. Start a conversation from "All Users".
              </p>
            ) : (
              chats.map((user) => (
                <button
                  key={user.uid}
                  onClick={() => onSelectUser(user)}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition text-left w-full"
                >
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${
                        user.displayName || user.email
                      }&background=random&color=fff&size=40`
                    }
                    alt={user.displayName || user.email}
                    className="w-10 h-10 rounded-full border-2 border-gray-700 object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm">
                        {user.displayName || user.email}
                      </div>

                      {/* Unread badge (only when unreadCount > 0) */}
                      {user.unreadCount > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center text-xs font-medium px-2 py-0.5 rounded-full bg-red-600 text-white">
                          {user.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {user.status === "active" ? "Active" : "Inactive"}
                    </div>
                  </div>
                </button>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}


export default ChatSidebar;
