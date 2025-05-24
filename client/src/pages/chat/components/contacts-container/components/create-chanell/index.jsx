import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { apiClient } from "@/lib/api-client";
import { CREATE_CHANNEL, GET_ALL_CONTACTS } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store";
import MultipleSelector from "@/components/ui/multipleselect";

const CreateChennel = () => {
  const [newChannelModel, setNewChannelModel] = useState(false);
  const { setSelectedChatType, setSelectedChatData, addChannel } =
    useAppStore();
  const [loading, setLoading] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await apiClient.get(GET_ALL_CONTACTS, {
          withCredentials: true,
        });
        setAllContacts(response.data.contacts);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const createChannel = async () => {
    try {
      if (channelName.length > 0 && selectedContacts.length > 0) {
        const response = await apiClient.post(
          CREATE_CHANNEL,
          {
            name: channelName,
            members: selectedContacts.map((contact) => contact.value),
          },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModel(false);
          addChannel(response.data.channel);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setNewChannelModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Create New Channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
        <DialogContent className="bg-[#181920] border-none text-white h-[400px] w-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Contact</DialogTitle>
            {/* <DialogDescription>Select Contact</DialogDescription> */}
          </DialogHeader>
          <div>
            <input
              type="text"
              className="rounded-lg p-4 bg-[#2c2e3b] border-none w-full"
              placeholder="Channel Name"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            {/* <Autocomplete
              multiple
              id="contacts-autocomplete"
              options={allContacts}
              getOptionLabel={(option) => option.firstName } // Customize label
              value={selectedContacts}
              onChange={setSelectedContacts}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Search Contacts"
                />
              )}
            /> */}

            {allContacts.length > 0 && (
              <MultipleSelector
                defaultOptions={allContacts}
                placeholder="Search Contacts"
                value={selectedContacts}
                onChange={setSelectedContacts}
                className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600">
                    No Results Found
                  </p>
                }
              />
            )}
          </div>
          <div>
            <Button
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 cursor-pointer"
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChennel;
