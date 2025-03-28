
import { useAppStore } from "@/store"
import { useSocket } from "../../../../../../../Context/SocketContext"
import EmojiPicker from "emoji-picker-react"
import { useEffect, useRef, useState } from "react"
import {GrAttachment} from 'react-icons/gr'
import { IoSend } from "react-icons/io5"
import { RiEmojiStickerLine } from "react-icons/ri"

const MessageBar = () => {
    const emojiRef = useRef();
    const {selectedChatType,selectedChatData,userInfo} = useAppStore()
    const [message, setMessage] = useState("");
    const [emojiPickerOpen, setemojiPickerOpen] = useState(false)
    const socket = useSocket();

    useEffect(() => {
        function handleClickOutside(event){
            if(emojiRef.current && !emojiRef.current.contains(event.target)){
                setemojiPickerOpen(false);
            }
        }
        document.addEventListener("mousedown",handleClickOutside)
        return () => {
            document.removeEventListener("mousedown",handleClickOutside)
        }
    },[emojiRef])

    const handleEmoji = (emoji) => {
            setMessage((msg) => msg+emoji.emoji)
    }

    const handleSendMessage = async () => {
        if (!message.trim()) return; // Avoid sending empty messages
    
        console.log("🟢 Selected Chat Data:", selectedChatData); // Debugging log
    
        if (selectedChatType === "contact" && selectedChatData?._id) { // ✅ Use _id instead of id
            const messageData = {
                sender: userInfo.id,
                recipient: selectedChatData._id, // ✅ Use _id
                content: message,
                messageType: "text",
                fileUrl: undefined
            };
    
            console.log("📤 Sending message:", messageData); // Debugging log
    
            if (!socket) {
                console.error("❌ Socket is not connected!");
                return;
            }
    
            socket.emit("sendMessage", messageData);
            setMessage(""); // Clear input
        } else {
            console.error("❌ `selectedChatData._id` is undefined!");
        }
    };
    
    
    
    

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
        <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
            <input type=" text " className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
                placeholder="Enter Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button className="text-neutral-500 focus:border-none focus:outline-none cursor-pointer
           focus:text-white duration-300 transition-all"
            // onClick={}
           >
                <GrAttachment className="text-2xl"/>
            </button>
            <div className="relative ">
            <button className="text-neutral-500 focus:border-none focus:outline-none cursor-pointer
           focus:text-white duration-300 transition-all"
           onClick={() => setemojiPickerOpen(true)}
           >
                <RiEmojiStickerLine className="text-2xl"/>
            </button>
            <div className="absolute bottom-16 right-0" ref={emojiRef}>
                    <EmojiPicker
                        theme="dark"
                        open={emojiPickerOpen}
                        onEmojiClick={handleEmoji}
                        autoFocusSearch={false}
                    />
            </div>
            </div>
        </div>
        <button className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none cursor-pointer
           focus:text-white duration-300 transition-all"
            onClick={handleSendMessage}
           >
                <IoSend className="text-2xl"/>
            </button>
    </div>
  )
}

export default MessageBar