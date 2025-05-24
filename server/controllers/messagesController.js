import Message from "../models/messagesModel.js";
import {mkdirSync, renameSync} from "fs"

export const GetMessages = async (req, response, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return response.status(400).send("Both ID's are required.");
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });
    return response.status(200).send({ messages });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal server error");
  }
};

export const uploadFile = async (req, response, next) => {
  try {
    if (!req.file) {
      return response.status(400).send("File is required.");
    };
    const date = Date.now();
    const fileDir = `upload/files/${date}`;
    const fileName = `${fileDir}/${req.file.originalname}`
    mkdirSync(fileDir, {recursive: true})
    renameSync(req.file.path, fileName)


    return response.status(200).send({ filePath: fileName });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal server error");
  }
};
