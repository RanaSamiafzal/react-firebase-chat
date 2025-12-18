


// /**
//  * Chat Component - Main chat interface
//  *
//  * This component handles the main chat functionality including:
//  * - User authentication and status tracking
//  * - Fetching and displaying all users
//  * - Managing chat conversations
//  * - User logout functionality
//  */

// import React, { useEffect, useState } from "react";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { auth, db } from "../../firebase";
// import { useNavigate } from "react-router-dom";
// import ChatSidebar from "../../components/chatcomp/ChatSidebar";
// import ChatWindow from "../../components/chatcomp/ChatWindow";
// import UserHeader from "../../components/UserHeader/UserHeader";
// import {
//   collection,
//   onSnapshot,
//   doc,
//   updateDoc,
//   query,
//   where,
//   getDoc,
// } from "firebase/firestore";

// function Chat() {
//   // Navigation hook for routing
//   const navigate = useNavigate();

//   // State management
//   const [currentUser, setCurrentUser] = useState(null); // Firebase auth user object
//   const [userData, setUserData] = useState(null); // User data from Firestore
//   const [allUsers, setAllUsers] = useState([]); // All users except current user
//   const [selectedUser, setSelectedUser] = useState(null); // Currently selected chat user
//   const [myChats, setMyChats] = useState([]); // User's chat conversations

//   /**
//    * Effect: Track user authentication state and update online status
//    * - Listens for auth changes
//    * - Updates user status to active/inactive
//    * - Handles page unload to set offline status
//    */
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         setCurrentUser(user);
//         setUserData(user);

//         // Update user status to active in Firestore
//         const userRef = doc(db, "users", user.uid);
//         await updateDoc(userRef, {
//           status: "active",
//           lastSeen: new Date(),
//         });

//         // Handle browser/tab close to set offline status
//         const handleBeforeUnload = async () => {
//           await updateDoc(userRef, {
//             status: "inactive",
//             lastSeen: new Date(),
//           });
//         };

//         window.addEventListener("beforeunload", handleBeforeUnload);
//         return () => {
//           window.removeEventListener("beforeunload", handleBeforeUnload);
//         };
//       } else {
//         // Redirect to login if not authenticated
//         navigate("/login");
//       }
//     });

//     return () => unsubscribe();
//   }, [navigate]);

//   /**
//    * Effect: Fetch all users from Firestore (excluding current user)
//    * - Real-time listener for users collection
//    * - Filters out current user from the list
//    */
//   useEffect(() => {
//     if (!currentUser) return;

//     const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
//       const users = snapshot.docs.map((doc) => ({
//         uid: doc.id,
//         ...doc.data(),
//       }));
//       // Filter out current user
//       setAllUsers(users.filter((u) => u.uid !== currentUser.uid));
//     });

//     return () => unsubscribe();
//   }, [currentUser]);

//   /**
//    * Effect: Listen for user's chat conversations
//    * - Queries chats where current user is a participant
//    * - Fetches other participant profiles
//    * - Sorts chats by last message time (most recent first)
//    */
//   useEffect(() => {
//     if (!currentUser) return;

//     // Query chats where current user is a participant
//     const q = query(
//       collection(db, "Chats"),
//       where("participantIds", "array-contains", currentUser.uid)
//     );

//     const unsubscribe = onSnapshot(q, async (snapshot) => {
//       const chats = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       // Sort chats by last message time (most recent first)
//       chats.sort((a, b) => {
//         const ta = a.lastMessageTime?.toMillis?.() || 0;
//         const tb = b.lastMessageTime?.toMillis?.() || 0;
//         return tb - ta;
//       });

//       // Fetch profiles of other participants for sidebar display
//       const chatUsers = await Promise.all(
//         chats.map(async (chat) => {
//           const otherId = chat.participantIds.find(
//             (id) => id !== currentUser.uid
//           );
//           if (!otherId) return null;

//           const userDoc = await getDoc(doc(db, "users", otherId));
//           if (!userDoc.exists()) return null;

//           return { uid: otherId, ...userDoc.data(), chatId: chat.id };
//         })
//       );

//       // Remove duplicates and null values
//       const unique = [];
//       const seen = new Set();
//       for (const u of chatUsers) {
//         if (u && !seen.has(u.uid)) {
//           seen.add(u.uid);
//           unique.push(u);
//         }
//       }

//       setMyChats(unique);
//     });

//     return () => unsubscribe();
//   }, [currentUser]);

//   /**
//    * Handle user logout
//    * - Updates user status to offline
//    * - Signs out from Firebase auth
//    * - Redirects to login page
//    */
//   const handleLogout = async () => {
//     if (currentUser) {
//       const userRef = doc(db, "users", currentUser.uid);
//       await updateDoc(userRef, {
//         status: "offline",
//         lastSeen: new Date(),
//       });
//     }
//     await signOut(auth);
//     navigate("/login");
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-950 text-white">
//       {/* Sidebar Section - Contains user header, chat list, and logout */}
//       <div className="w-[350px] bg-gray-900 flex flex-col p-4 border-r border-gray-800">
//         {/* User header component */}
//         <UserHeader currentUser={userData} setCurrentUser={setUserData} />

//         {/* Chat sidebar with users and conversations */}
//         <ChatSidebar
//           currentUser={currentUser}
//           users={allUsers}
//           chats={myChats}
//           onSelectUser={(user) => setSelectedUser(user)}
//         />

//         {/* Logout button */}
//         <button
//           onClick={handleLogout}
//           className="mt-4 bg-red-700 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
//         >
//           Logout
//         </button>
//       </div>

//       {/* Main chat window area */}
//       <div className="flex-1 h-screen overflow-hidden">
//         <ChatWindow selectedUser={selectedUser} currentUser={currentUser} />
//       </div>
//     </div>
//   );
// }

// export default Chat;






/**
 * Chat Component - Main chat interface
 *
 * This component handles the main chat functionality including:
 * - User authentication and status tracking
 * - Fetching and displaying all users
 * - Managing chat conversations
 * - User logout functionality
 */

import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import ChatSidebar from "../../components/chatcomp/ChatSidebar";
import ChatWindow from "../../components/chatcomp/ChatWindow";
import UserHeader from "../../components/UserHeader/UserHeader";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";

function Chat() {
  // Navigation hook for routing
  const navigate = useNavigate();

  // State management
  const [currentUser, setCurrentUser] = useState(null); // Firebase auth user object
  const [userData, setUserData] = useState(null); // User data from Firestore
  const [allUsers, setAllUsers] = useState([]); // All users except current user
  const [selectedUser, setSelectedUser] = useState(null); // Currently selected chat user
  const [myChats, setMyChats] = useState([]); // User's chat conversations

  /**
   * Effect: Track user authentication state and update online status
   * - Listens for auth changes
   * - Updates user status to active/inactive
   * - Handles page unload to set offline status
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setUserData(user);

        // Update user status to active in Firestore
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          status: "active",
          lastSeen: new Date(),
        });

        // Handle browser/tab close to set offline status
        const handleBeforeUnload = async () => {
          await updateDoc(userRef, {
            status: "inactive",
            lastSeen: new Date(),
          });
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
          window.removeEventListener("beforeunload", handleBeforeUnload);
        };
      } else {
        // Redirect to login if not authenticated
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  /**
   * Effect: Fetch all users from Firestore (excluding current user)
   * - Real-time listener for users collection
   * - Filters out current user from the list
   */
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      // Filter out current user
      setAllUsers(users.filter((u) => u.uid !== currentUser.uid));
    });

    return () => unsubscribe();
  }, [currentUser]);

  /**
   * Effect: Listen for user's chat conversations
   * - Queries chats where current user is a participant
   * - Fetches other participant profiles
   * - Sorts chats by last message time (most recent first)
   * - Includes unread count for current user (chat.unreadCounts[currentUser.uid] || 0)
   */
  useEffect(() => {
    if (!currentUser) return;

    // Query chats where current user is a participant
    const q = query(
      collection(db, "Chats"),
      where("participantIds", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort chats by last message time (most recent first)
      chats.sort((a, b) => {
        const ta = a.lastMessageTime?.toMillis?.() || 0;
        const tb = b.lastMessageTime?.toMillis?.() || 0;
        return tb - ta;
      });

      // Fetch profiles of other participants for sidebar display
      const chatUsers = await Promise.all(
        chats.map(async (chat) => {
          const otherId = chat.participantIds.find(
            (id) => id !== currentUser.uid
          );
          if (!otherId) return null;

          const userDoc = await getDoc(doc(db, "users", otherId));
          if (!userDoc.exists()) return null;

          // Attach unreadCount for current user (default 0)
          const unreadCount =
            (chat.unreadCounts && chat.unreadCounts[currentUser.uid]) || 0;

          return {
            uid: otherId,
            ...userDoc.data(),
            chatId: chat.id,
            unreadCount,
          };
        })
      );

      // Remove duplicates and null values
      const unique = [];
      const seen = new Set();
      for (const u of chatUsers) {
        if (u && !seen.has(u.uid)) {
          seen.add(u.uid);
          unique.push(u);
        }
      }

      setMyChats(unique);
    });

    return () => unsubscribe();
  }, [currentUser]);

  /**
   * Handle user logout
   * - Updates user status to offline
   * - Signs out from Firebase auth
   * - Redirects to login page
   */
  const handleLogout = async () => {
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        status: "offline",
        lastSeen: new Date(),
      });
    }
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar Section - Contains user header, chat list, and logout */}
      <div className="w-[350px] bg-gray-900 flex flex-col p-4 border-r border-gray-800">
        {/* User header component */}
        <UserHeader currentUser={userData} setCurrentUser={setUserData} />

        {/* Chat sidebar with users and conversations */}
        <ChatSidebar
          currentUser={currentUser}
          users={allUsers}
          chats={myChats}
          onSelectUser={(user) => setSelectedUser(user)}
        />

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-700 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Main chat window area */}
      <div className="flex-1 h-screen overflow-hidden">
        <ChatWindow selectedUser={selectedUser} currentUser={currentUser} />
      </div>
    </div>
  );
}

export default Chat;
