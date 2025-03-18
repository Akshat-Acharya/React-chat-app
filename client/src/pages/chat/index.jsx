import { useAppStore } from '@/store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Chat = () => {

  const {userInfo} = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if(!userInfo.profileSetup){
      toast("Please Set up your Profile");
      navigate("/profile")
    }
  },[userInfo,navigate])


  return (
    <div>
    chat
    </div>
  )
}

export default Chat