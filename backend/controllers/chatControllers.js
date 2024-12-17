const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const { model } = require("mongoose");
const router = require("../routes/chatRoutes");


const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        console.log("userId param not sent with  request");
        return res.sendStatus(4000);
        
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elementMatch: { $eq: req.user?._id } } },
            { users: { $elementMatch: { $eq: user?._id } } },
        ]
    }).populate("users", "password").populate("latestmessage");
    isChat = await User.populate(isChat, {
        path: "latestMessage.sendet",
        select: "name pic email",

    });
    if (isChat.length > 0) {
        res.send(isChat[0]);

    } else {
        var chatData = {
            chatName: "sender",
            users: [req.user?._id, userId],

        };
        try {
            const createdChat = await chat.create(chatData);
              
            const Fullchat = await Chat.findOne({ _id: createdChat?._id }).populate
                ("users", "password");
            res.status(200).send(Fullchat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});
// const fetchChats = asynhandler(async (req, res) => {
//     try {
//         Chat.find({ users: { $elemMatch: { $eq: req.user?._id } } })
//             .populate("users", "-password")
//             .populate("groupAdmin", "-password")
//             .populate("latestMessage")
//             .sort9({ updatedAt: -1 })
//             .then(async (results) => {
//                 results = await User.populate(results, {
//                     path: "latestMessage.sender",
//                     select: "name pic email",

//                 });
//                 res.status(200).send(results);
//             })
//     } catch (error) {
//         res.status(400);
//         throw new Error(error.message);
//     }
// });


const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const createGroupChat = asyncHandler(async (req, res) => {
    // console.log('0groupChat',req.body)
    if (!req.body?.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all The feilds" });
        
    }
    var users = JSON.parse(req.body?.users);
    if (users.length < 2) {
        return res
            .status(400)
            .send("More than two user are required to form a group chat");
    }
    users?.push(req.user);
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        // console.log('chatttt',groupChat)
        const fullGroupChat = await Chat.findOne({ _id: groupChat?._id })
        // console.log('fulll',fullGroupChat)
    //   .populate("users", "-password")
    //   .populate("groupAdmin", "-password");
        
        res.status(200).json(fullGroupChat);
    } catch (error) { 
        res.status(400);
        throw new Error(error.message);
    }
});
const renameGroupChat = asyncHandler(async (req, res) => {
    const { chatID, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatID,
        {
            chatName
        },
        {
            new: true,
        },

    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    if (!updatedChat) {
        return res.status(400)
        throw new Error("Chat not found");
    } else {
        res.json(updatedChat)
    }
});

const addToGroup = asyncHandler(async (req, res) => {
    const { chatID, chatName } = req.body;
    const added = Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
            
        },
        { new: true }
        
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    if (!added) {
        return res.status(400)
        throw new Error("Chat not found");
    } else {
        res.json(added)
    }
});
const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatID, chatName } = req.body;
    const removed = Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
            
        },
        { new: true }
        
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    if (!removed) {
        return res.status(400)
        throw new Error("Chat not found");
    } else {
        res.json(removed)
    }
});
module.exports= { accessChat,fetchChats,createGroupChat,renameGroupChat,addToGroup,removeFromGroup };


