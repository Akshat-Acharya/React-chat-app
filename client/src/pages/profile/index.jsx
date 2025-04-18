import { useAppStore } from "@/store";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { HOST, REMOVE_PROFILE_IMAGE, UPDATE_PROFILE_ROUTE, ADD_PROFILE_IMAGE } from "@/utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();

  // Ensure state variables always have valid default values
  const [firstName, setFirstName] = useState(userInfo.firstName || "");
  const [lastName, setLastName] = useState(userInfo.lastName || "");
  const [image, setImage] = useState(userInfo.image ? `${HOST}/${userInfo.image}` : "");
  const [hover, setHover] = useState(false);
  const [selectedColor, setSelectedColor] = useState(userInfo.color ?? 0);
  const fileInputRef = useRef(null);

  // Ensure useEffect correctly updates state with fallback values
  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName || ""); // Default to empty string if undefined
      setLastName(userInfo.lastName || "");
      setSelectedColor(userInfo.color ?? 0);
    }
    setImage(userInfo.image ? `${HOST}/${userInfo.image}` : "");
  }, [userInfo]);

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please set up profile");
    }
  };

  const validateProfile = () => {
    if (!firstName.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!lastName.trim()) {
      toast.error("Last name is required");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile updated successfully");
          navigate("/chat");
        }
      } catch (e) {
        console.error("Error updating profile:", e);
        toast.error("Failed to update profile");
      }
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);

      try {
        const response = await apiClient.post(ADD_PROFILE_IMAGE, formData, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.image) {
          setUserInfo({ ...userInfo, image: response.data.image });
          setImage(`${HOST}/${response.data.image}`);
          toast.success("Image updated successfully");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to update image");
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUserInfo((prev) => ({ ...prev, image: null }));
        setImage("");
        toast.success("Image removed successfully");
      }
    } catch (e) {
      console.error("Error removing image:", e);
      toast.error("Failed to remove image");
    }
  };

  return (
    <div className="bg-[#1b1c24] h-screen flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName ? firstName.charAt(0) : userInfo.email.charAt(0)}
                </div>
              )}
            </Avatar>
            {hover && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? <FaTrash className="text-white text-3xl" /> : <FaPlus className="text-white text-3xl" />}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png, .jpg, .jpeg, .svg, .webp"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <Input placeholder="Email" type="email" disabled value={userInfo.email || ""} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
            <Input placeholder="First Name" type="text" onChange={(e) => setFirstName(e.target.value)} value={firstName || ""} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
            <Input placeholder="Last Name" type="text" onChange={(e) => setLastName(e.target.value)} value={lastName || ""} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div key={index} className={`${color} h-8 w-8 rounded-full cursor-pointer ${selectedColor === index ? "outline-white/50 outline-2" : ""}`} onClick={() => setSelectedColor(index)}></div>
              ))}
            </div>
          </div>
        </div>
        <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all" onClick={saveChanges}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;
