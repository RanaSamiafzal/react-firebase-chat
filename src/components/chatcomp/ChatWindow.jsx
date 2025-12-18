// /**
//  * ChatWindow Component - Individual chat conversation interface
//  *
//  * This component handles the display and interaction for a single chat conversation:
//  * - Displays selected user's profile and status
//  * - Shows real-time message history
//  * - Handles sending new messages (click or Enter key)
//  * - Manages message input and UI state
//  */

// import React, { useState, useEffect } from "react";
// import { auth, db } from "../../firebase";
// import {
//   getDoc,
//   doc,
//   onSnapshot,
//   collection,
//   addDoc,
//   serverTimestamp,
//   setDoc,
// } from "firebase/firestore";
// import { Send, Paperclip, Smile } from "lucide-react";

// function ChatWindow({ selectedUser, currentUser }) {
//   // State management
//   const [userInfo, setUserInfo] = useState(null); // Selected user's profile data
//   const [message, setMessage] = useState(""); // Current message input
//   const [messagesList, setMessagesList] = useState([]); // List of messages in chat

//   /**
//    * Utility function to capitalize display names
//    * @param {string} name - The name to format
//    * @returns {string} Capitalized name or empty string if null
//    */
//   const formatName = (name) =>
//     name ? name.charAt(0).toUpperCase() + name.slice(1) : "";

//   /**
//    * Generate consistent chat ID for two users
//    * @param {string} uid1 - First user ID
//    * @param {string} uid2 - Second user ID
//    * @returns {string} Sorted and joined user IDs
//    */
//   const getChatId = (uid1, uid2) => [uid1, uid2].sort().join("_");

//   /**
//    * Handle sending messages to the selected user
//    * Creates chat document if it doesn't exist, adds message, and updates chat metadata
//    * @param {string} text - The message text to send
//    */
//   const handleSendMessage = async (text) => {
//     if (!selectedUser || !text.trim()) return;

//     if (!currentUser) {
//       console.error("❌ No authenticated user found.");
//       return;
//     }

//     const currentUserId = currentUser.uid;
//     const receiverId = selectedUser.uid;
//     const chatId = getChatId(currentUserId, receiverId);

//     const chatRef = doc(db, "Chats", chatId);
//     const messageRef = collection(chatRef, "messages");

//     try {
//       // Ensure chat document exists (required for Firestore security rules)
//       const chatDoc = await getDoc(chatRef);
//       if (!chatDoc.exists()) {
//         await setDoc(chatRef, {
//           participantIds: [currentUserId, receiverId],
//           createdAt: serverTimestamp(),
//           lastMessage: "",
//           lastMessageTime: null,
//         });
//         console.log("🆕 Chat created:", chatId);
//       }

//       // Add the message to the messages subcollection
//       await addDoc(messageRef, {
//         senderId: currentUserId,
//         receiverId,
//         text,
//         timestamp: serverTimestamp(),
//       });

//       // Update chat document with latest message info
//       await setDoc(
//         chatRef,
//         {
//           participantIds: [currentUserId, receiverId],
//           lastMessage: text,
//           lastMessageTime: serverTimestamp(),
//         },
//         { merge: true }
//       );

//       console.log("✅ Message sent!");
//     } catch (error) {
//       console.error("❌ Error sending message:", error);
//     }
//   };

//   /**
//    * Effect: Listen for real-time message updates
//    * Subscribes to the messages subcollection of the current chat
//    */
//   useEffect(() => {
//     if (!selectedUser || !currentUser) return;

//     const currentUserId = currentUser.uid;
//     const receiverId = selectedUser.uid;
//     const chatId = getChatId(currentUserId, receiverId);

//     const chatRef = doc(db, "Chats", chatId);
//     const messageRef = collection(chatRef, "messages");

//     const unsubscribe = onSnapshot(
//       messageRef,
//       (snapshot) => {
//         const msgs = snapshot.docs
//           .map((doc) => ({ id: doc.id, ...doc.data() }))
//           .sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);

//         setMessagesList(msgs);
//       },
//       (error) => console.error("❌ Error fetching messages:", error)
//     );

//     return () => unsubscribe();
//   }, [selectedUser, currentUser]);

//   /**
//    * Effect: Listen for selected user's profile updates
//    * Keeps user info (status, display name, etc.) in sync
//    */
//   useEffect(() => {
//     if (!selectedUser?.uid) return;

//     const userRef = doc(db, "users", selectedUser.uid);
//     const unsubscribe = onSnapshot(userRef, (docSnap) => {
//       if (docSnap.exists()) {
//         setUserInfo(docSnap.data());
//       }
//     });

//     return () => unsubscribe();
//   }, [selectedUser]);

//   return (
//     <div className="flex flex-col h-full overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
//       {selectedUser ? (
//         <>
//           {/* Chat Header - Shows selected user's info and status */}
//           <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 shadow-sm">
//             <div className="flex items-center gap-3">
//               <img
//                 src={
//                   selectedUser?.photoURL ||
//                   `https://ui-avatars.com/api/?name=${
//                     userInfo?.displayName ||
//                     userInfo?.email?.split("@")[0] ||
//                     selectedUser?.displayName ||
//                     selectedUser?.email?.split("@")[0] ||
//                     "User"
//                   }&background=random&color=fff&size=40`
//                 }
//                 alt="User Avatar"
//                 className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover"
//               />
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
//                   {formatName(
//                     userInfo?.displayName ||
//                       userInfo?.email?.split("@")[0] ||
//                       selectedUser?.displayName ||
//                       selectedUser?.email?.split("@")[0]
//                   )}
//                 </h2>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   {userInfo?.status === "active"
//                     ? "🟢 Active now"
//                     : userInfo?.lastSeen
//                     ? `⚪ Last seen ${new Date(
//                         userInfo?.lastSeen?.toDate()
//                       ).toLocaleTimeString()}`
//                     : "⚪ Offline"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Messages Container - Scrollable area showing chat history */}
//           <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50 dark:bg-gray-900 space-y-4">
//             {messagesList.length > 0 ? (
//               messagesList.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`flex ${
//                     msg.senderId === currentUser?.uid
//                       ? "justify-end"
//                       : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-xs px-4 py-2 rounded-2xl shadow-md ${
//                       msg.senderId === currentUser?.uid
//                         ? "bg-indigo-600 text-white rounded-br-none"
//                         : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
//                     }`}
//                   >
//                     <p className="text-sm">{msg.text}</p>
//                     <span className="block text-xs text-gray-400 mt-1 text-right">
//                       {msg.timestamp?.seconds
//                         ? new Date(
//                             msg.timestamp.seconds * 1000
//                           ).toLocaleTimeString()
//                         : ""}
//                     </span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500 dark:text-gray-400 text-center">
//                 No messages yet. Start the conversation 👋
//               </p>
//             )}
//           </div>

//           {/* Message Input Area - Text input and send controls */}
//           <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 shadow-sm">
//             {/* Emoji button (placeholder for future functionality) */}
//             <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
//               <Smile size={22} className="text-gray-600 dark:text-gray-300" />
//             </button>

//             {/* Attachment button (placeholder for future functionality) */}
//             <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
//               <Paperclip
//                 size={22}
//                 className="text-gray-600 dark:text-gray-300"
//               />
//             </button>

//             {/* Message input field */}
//             <input
//               type="text"
//               placeholder="Type a message..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   handleSendMessage(message);
//                   setMessage("");
//                 }
//               }}
//               className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-600"
//             />

//             {/* Send button */}
//             <button
//               onClick={() => {
//                 handleSendMessage(message);
//                 setMessage("");
//               }}
//               className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-full transition shadow-md"
//             >
//               <Send size={22} className="text-white" />
//             </button>
//           </div>
//         </>
//       ) : (
//         /* Placeholder when no user is selected */
//         <div className="flex-1 flex items-center justify-center">
//           <p className="text-gray-500 dark:text-gray-400 text-lg">
//             Select a user to start conversation
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ChatWindow;

/**
 * ChatWindow Component - Individual chat conversation interface
 *
 * This component handles the display and interaction for a single chat conversation:
 * - Displays selected user's profile and status
 * - Shows real-time message history
 * - Handles sending new messages (click or Enter key)
 * - Manages message input and UI state
 *
 * NOTE: Added per-chat unreadCounts logic:
 * - Chat doc has an `unreadCounts` object keyed by userId.
 * - When sending a message, we increment receiver's unread count.
 * - When opening the chat, we reset current user's unread count to 0.
 */

import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import {
  getDoc,
  doc,
  onSnapshot,
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { Send, Paperclip, Smile } from "lucide-react";

function ChatWindow({ selectedUser, currentUser }) {
  // State management
  const [userInfo, setUserInfo] = useState(null); // Selected user's profile data
  const [message, setMessage] = useState(""); // Current message input
  const [messagesList, setMessagesList] = useState([]); // List of messages in chat

  /**
   * Utility function to capitalize display names
   * @param {string} name - The name to format
   * @returns {string} Capitalized name or empty string if null
   */
  const formatName = (name) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1) : "";

  /**
   * Generate consistent chat ID for two users
   * @param {string} uid1 - First user ID
   * @param {string} uid2 - Second user ID
   * @returns {string} Sorted and joined user IDs
   */
  const getChatId = (uid1, uid2) => [uid1, uid2].sort().join("_");

  /**
   * Handle sending messages to the selected user
   * Creates chat document if it doesn't exist, adds message, and updates chat metadata
   * Also increments receiver's unread count in the chat doc.
   * @param {string} text - The message text to send
   */
  const handleSendMessage = async (text) => {
    if (!selectedUser || !text.trim()) return;

    if (!currentUser) {
      console.error("❌ No authenticated user found.");
      return;
    }

    const currentUserId = currentUser.uid;
    const receiverId = selectedUser.uid;
    const chatId = getChatId(currentUserId, receiverId);

    const chatRef = doc(db, "Chats", chatId);
    const messageRef = collection(chatRef, "messages");

    try {
      // Ensure chat document exists (required for Firestore security rules)
      const chatDoc = await getDoc(chatRef);
      if (!chatDoc.exists()) {
        // Initialize unreadCounts for both users
        await setDoc(chatRef, {
          participantIds: [currentUserId, receiverId],
          createdAt: serverTimestamp(),
          lastMessage: "",
          lastMessageTime: null,
          unreadCounts: {
            [currentUserId]: 0,
            [receiverId]: 0,
          },
        });
        console.log("🆕 Chat created:", chatId);
      }

      // Add the message to the messages subcollection
      await addDoc(messageRef, {
        senderId: currentUserId,
        receiverId,
        text,
        timestamp: serverTimestamp(),
      });

      // Update chat document with latest message info AND increment receiver unread count
      await updateDoc(chatRef, {
        participantIds: [currentUserId, receiverId],
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        // increment the receiver's unread count atomically
        [`unreadCounts.${receiverId}`]: increment(1),
      });

      console.log("✅ Message sent!");
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  /**
   * Effect: Listen for real-time message updates
   * Subscribes to the messages subcollection of the current chat
   */
  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    const currentUserId = currentUser.uid;
    const receiverId = selectedUser.uid;
    const chatId = getChatId(currentUserId, receiverId);

    const chatRef = doc(db, "Chats", chatId);
    const messageRef = collection(chatRef, "messages");

    const unsubscribe = onSnapshot(
      messageRef,
      (snapshot) => {
        const msgs = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);

        setMessagesList(msgs);
      },
      (error) => console.error("❌ Error fetching messages:", error)
    );

    return () => unsubscribe();
  }, [selectedUser, currentUser]);

  /**
   * Effect: Listen for selected user's profile updates
   * Keeps user info (status, display name, etc.) in sync
   * Also: when opening the chat, reset unread count for current user to 0
   */
  useEffect(() => {
    if (!selectedUser?.uid || !currentUser) return;

    const userRef = doc(db, "users", selectedUser.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserInfo(docSnap.data());
      }
    });

    // Reset unread count for current user in this chat
    (async () => {
      try {
        const chatId = getChatId(currentUser.uid, selectedUser.uid);
        const chatRef = doc(db, "Chats", chatId);
        const chatSnap = await getDoc(chatRef);
        if (chatSnap.exists()) {
          // Only update if unreadCounts exists and current user's count isn't already 0
          const data = chatSnap.data();
          const currentCount =
            (data.unreadCounts && data.unreadCounts[currentUser.uid]) || 0;
          if (currentCount !== 0) {
            await updateDoc(chatRef, {
              [`unreadCounts.${currentUser.uid}`]: 0,
            });
          }
        }
      } catch (err) {
        console.error("❌ Error resetting unread count:", err);
      }
    })();

    return () => unsubscribe();
  }, [selectedUser, currentUser]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      {selectedUser ? (
        <>
          {/* Chat Header - Shows selected user's info and status */}
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={
                  selectedUser?.photoURL ||
                  `https://ui-avatars.com/api/?name=${
                    userInfo?.displayName ||
                    userInfo?.email?.split("@")[0] ||
                    selectedUser?.displayName ||
                    selectedUser?.email?.split("@")[0] ||
                    "User"
                  }&background=random&color=fff&size=40`
                }
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatName(
                    userInfo?.displayName ||
                      userInfo?.email?.split("@")[0] ||
                      selectedUser?.displayName ||
                      selectedUser?.email?.split("@")[0]
                  )}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userInfo?.status === "active"
                    ? "🟢 Active now"
                    : userInfo?.lastSeen
                    ? `⚪ Last seen ${new Date(
                        userInfo?.lastSeen?.toDate()
                      ).toLocaleTimeString()}`
                    : "⚪ Offline"}
                </p>
              </div>
            </div>
          </div>

          {/* Messages Container - Scrollable area showing chat history */}
          <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50 dark:bg-gray-900 space-y-4">
            {messagesList.length > 0 ? (
              messagesList.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === currentUser?.uid
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl shadow-md ${
                      msg.senderId === currentUser?.uid
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className="block text-xs text-gray-400 mt-1 text-right">
                      {msg.timestamp?.seconds
                        ? new Date(
                            msg.timestamp.seconds * 1000
                          ).toLocaleTimeString()
                        : ""}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center">
                No messages yet. Start the conversation 👋
              </p>
            )}
          </div>

          {/* Message Input Area - Text input and send controls */}
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 shadow-sm">
            {/* Emoji button (placeholder for future functionality) */}
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
              <Smile size={22} className="text-gray-600 dark:text-gray-300" />
            </button>

            {/* Attachment button (placeholder for future functionality) */}
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
              <Paperclip
                size={22}
                className="text-gray-600 dark:text-gray-300"
              />
            </button>

            {/* Message input field */}
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(message);
                  setMessage("");
                }
              }}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-600"
            />

            {/* Send button */}
            <button
              onClick={() => {
                handleSendMessage(message);
                setMessage("");
              }}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-full transition shadow-md"
            >
              <Send size={22} className="text-white" />
            </button>
          </div>
        </>
      ) : (
        /* Placeholder when no user is selected */
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Select a user to start conversation
          </p>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
