import Logo from "@/assets/logo";
import ProfileInfo from "./components/profile-info";
import NewDM from "./components/new-dm";
import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { GET_DM_CONTACTS_LIST, GET_USER_CHANNELS } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/ui/contact-list";
import CreateChennel from "./components/create-chanell";


const ContactsContainer = () => {

  const {setDirectMessagesContacts, directMessagesContacts,channels, setChannels} = useAppStore();

  useEffect(() => {

    const getContactsList = async() => {
      try {
        const response = await apiClient.get(GET_DM_CONTACTS_LIST, {withCredentials:true})
        if(response.data.contacts){
          setDirectMessagesContacts(response.data.contacts)
        }
      } catch (error) {
        console.log(error)
      }
    }
    const getChannels = async() => {
      try {
        const response = await apiClient.get(GET_USER_CHANNELS, {withCredentials:true})
        if(response.data.channels){
          setChannels(response.data.channels)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getContactsList();
    getChannels();
  },[setChannels, setDirectMessagesContacts])
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full overflow-y-auto">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text={"Single Chat"}/>
          <NewDM />
        </div>
        <div className="max-w-[38vw] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts}/>
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text={"Group Chat"}/>
          <CreateChennel />
        </div>
        <div className="max-w-[38vw] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true}/>
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};



export default ContactsContainer;

const Title = ({text}) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 text-opacity-90 font-light text-sm">
      {text}
    </h6>
  )
}

