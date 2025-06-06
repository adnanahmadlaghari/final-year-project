import { useAppStore } from "@/store";
import React from "react";
import { Avatar, AvatarImage } from "./avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    selectedChatType,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("group");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };
//   console.log(contacts)
  return (
    <div className="mt-5">
      {contacts.map((contact, index) => {
        return (
          <div
            className={`pl-10 py-2 transition-all duration-300 cursor-pointer mb-2 m-2 rounded-2xl ${
              selectedChatData && selectedChatData._id === contact._id
                ? "bg-[#8417ff] hover:bg-[#8417ff]"
                : "hover:bg-[#f1f1f111]"
            }`}
            key={contact._id}
            onClick={() => handleClick(contact)}
          >
            <div className="flex justify-start items-center gap-5 text-neutral-300">
              {!isChannel && (
                <Avatar className={"w-10 h-10  rounded-full overflow-hidden"}>
                  {contact.image ? (
                    <AvatarImage
                      src={`${HOST}/${contact.image}`}
                      alt="profile"
                      className={"object-cover h-full bg-black"}
                    />
                  ) : (
                    <div
                      className={`
                        ${
                          selectedChatData &&
                          selectedChatData._id === contact._id
                            ? "bg-[#ffffff22] border border-white/70"
                            : getColor(contact.color)
                        }
                        h-10 w-10  text-lg border-[1px] flex items-center justify-center uppercase rounded-full`}
                    >
                      {contact.firstName
                        ? contact.firstName.split("").shift()
                        : contact.email.split("").shift()}
                    </div>
                  )}
                </Avatar>
              )}
              {isChannel && (
                <div className="bg-[#ffffff22] flex h-10 w-10 items-center justify-center rounded-full">
                #
                </div>
              )}
                {isChannel ? (
                    <span>{contact.name}</span>
                  ) : (
                    <span>{contact.firstName ? `${contact.firstName} ${contact.lastName}`: contact.email}</span>
                  )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
