import mongoose from "mongoose";
import channel from "../models/channelModel.js";
import User from "../models/userModel.js";
import Channel from "../models/channelModel.js";

export const createChannel = async (req, response, next) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;

    const admin = await User.findById(userId);

    if (!admin) {
      return response.status(400).send("Admin not found.");
    }
    const validMembers = await User.find({ _id: { $in: members } });

    if (validMembers.length !== members.length) {
      return response.status(400).send("Some members are not valid users.");
    }

    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });

    await newChannel.save();
    return response.status(201).json({ channel: newChannel });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal server error");
  }
};

export const getUserChannel = async (req, response, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    return response.status(201).json({ channels });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal server error");
  }
};

export const getChannelMessages = async (req, response, next) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id image color",
      },
    });
    if (!channel) {
      return response.status(404).send("");
    }
    const messages = channel.messages;
    return response.status(201).json({ messages });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal server error");
  }
};
