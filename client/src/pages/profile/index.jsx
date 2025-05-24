import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE, REMOVE_PROFILE_IMAGE, Update_Profile } from "@/utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
      
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required.");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required.");
      return false;
    }
    return true;
  };
  const handleUpdate = async () => {
    if (validateProfile()) {
      setLoading(true);
      try {
        const response = await apiClient.post(
          Update_Profile,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          useAppStore.getState().setUserInfo({ ...response.data });
          toast.success("Profile Update Successfully.");
          navigate("/chat");
        }
        console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please complete profile.");
    }
  };

  const handleIpututClick = () => {
    fileInputRef.current.click();
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if(file){
      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE, formData, {withCredentials: true});
      if(response.status === 200 && response.data.image){
        setUserInfo({...userInfo, image: response.data.image});
        toast.success("Image Update Successfull.")
      };
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      }
      reader.readAsDataURL(file);
    }
  };
  const handleImageDelete = async() => {
    setLoading(true)
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE, {withCredentials: true});
      if(response.status === 200){
        setUserInfo({...userInfo, image: null});
        toast.success("Profile Image Removed");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  };
  return (
    <div className="bg-[#1b1c24] h-[100vh] flex flex-col items-center justify-center gap-10">
      <div className="flex flex-col w-[80vw] md:w-max gap-10">
        <div className="cursor-pointer" onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex justify-center items-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar
              className={
                "w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden"
              }
            >
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className={"object-cover h-full bg-black"}
                />
              ) : (
                <div
                  className={`h-32 w-32 md:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center uppercase rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full "
                onClick={image ? handleImageDelete : handleIpututClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" name="profile-image" accept="/image"/>
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <input
                type="email"
                placeholder="Email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 border-none bg-[#2c2e3b]"
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg p-6 border-none bg-[#2c2e3b]"
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 border-none bg-[#2c2e3b]"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, idx) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === idx
                      ? "outline outline-white/90 outline-1"
                      : ""
                  }`}
                  key={idx}
                  onClick={() => setSelectedColor(idx)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 cursor-pointer"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
