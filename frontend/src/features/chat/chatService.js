import {
  collection,
  addDoc,
  orderBy,
  query,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";

/**
 * Sends a chat message to Firestore.
 * @param {string} sender
 * @param {string} receiver
 * @param {string} text
 * @returns {Promise<void>}
 */
export const sendMessage = async (sender, receiver, text) => {
  try {
    await addDoc(collection(db, "messages"), {
      sender,
      receiver,
      text,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

/**
 * Sets up a real-time listener to fetch messages.
 * @param {(messages: ChatMessage[]) => void} callback
 * @returns {() => void} Unsubscribe function
 */
export const fetchMessages = (callback) => {
  try {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          text: data.text,
          sender: data.sender,
          receiver: data.receiver,
          timestamp: data.timestamp,
        });
      });

      callback(messages);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up message listener:", error);
    return () => {}; // Fallback noop
  }
};