import ConnectionRequest from "../models/connectionRequest.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import {sendConnectionAcceptedEmail} from "../emails/emailHandlers.js";

export const sendConnectionRequest = async (req, res) => {
    try {
        const {userId} = req.params;
        const senderId = req.user._id;

        if(senderId.toString() === userId){
            return res.status(400).json({message: "You cannot send a connection request to yourself."});
        }

        if(req.user.connections.includes(userId)){
            return res.status(400).json({message: "You are already connected with this user."});
        }

        const existingRequest = await ConnectionRequest.findOne({
            sender: senderId,
            receiver: userId,
            status: "pending",
        });

        if(existingRequest){
            return res.status(400).json({message: "Connection request already exists."});
        }

        const newRequest = new ConnectionRequest({
            sender: senderId,
            recipient: userId,
        })
        
        await newRequest.save();

        res.status(201).json({message: "Connection request sent successfully."});
    } catch (error) {
        console.log("Error in sendConnectionRequest controller: ", error);
        res.status(500).json({message: "server error"});
    }
}

export const acceptConnectionRequest = async (req, res)=>{
    try {
        const {requestId} = req.params;
        const userId = req.user._id;

        const request = await ConnectionRequest.findById(requestId)
        .populate("sender", "name username email")
        .populate("recipient", "name username");

        if(!request){
            return res.status(404).json({message: "Connection request not found."});
        }

        // check if the req is for the current user
        if(request.recipient._id.toString() !== userId.toString()){
            return res.status(403).json({message: "Not authorized to accept this request."});
        }

        if(request.status !== "pending"){
            return res.status(400).json({message: "This request has already been processed"});
        }

        request.status = "accepted";
        await request.save();

        // if i'm your friend then your also my friend.
        await User.findByIdAndUpdate(request.sender._id, {
            $addToSet: {connections: userId},
        });
        await User.findByIdAndUpdate(userId, {
            $addToSet: {connections: request.sender._id},
        });

        const notification = new Notification({
            recipient: request.sender._id,
            type: "connectionAccepted",
            relatedUser: userId,
        })

        await notification.save(); 

        res.status(200).json({message: "Connection request accepted successfully."});

        const senderEmail = request.sender.email;
        const senderName = request.sender.name;
        const recipientName = request.recipient.name;
        const profileUrl = process.env.CLIENT_URL+"/profile/"+request.sender.username;

        try {
            await sendConnectionAcceptedEmail(senderEmail, senderName, recipientName, profileUrl);

        } catch (error) {
            console.log("Error sending connection accepted email: ", error);
        }

    } catch (error) {
        console.log("Error in acceptConnectionRequest controller: ", error);    
        res.status(500).json({message: "server error"});
    }
}

export const rejectConnectionRequest = async (req, res)=>{
    try {
        const {requestId} = req.params;
        const userId = req.user._id;

        const request = await ConnectionRequest.findById(requestId);

        if(request.recipient.toString() !== userId.toString()){
            return res.status(403).json({message: "Not authorized to reject this request."});
        }

        if(request.status !== "pending"){
            return res.status(400).json({message: "This request has already been processed."});
        }

        request.status = "rejected";
        await request.save();

        res.json({message: "Connection request rejected."});

    } catch (error) {
        console.error("Error in rejectConnectionRequest controller: ", error);
        res.status(500).json({message: "server error"});
    }
}

export const getConnectionRequests = async (req, res)=>{
    try {
        const userId = req.user._id;

        if(!userId){
            res.status(400).json({message: "userId is missing."});
        }

        const requests = await ConnectionRequest.find({
            recipient: userId,
            status: "pending",
        })
        .populate("sender", "name username profilePicture headline connections");

        res.status(200).json(requests);

    } catch (error) {
        console.error("Error in getConnectionRequests controller: ", error);
        res.status(500).json({message: "server error"});
    }
}

export const getUserConnections = async (req, res)=>{
    try {
        const userId = req.user._id;

        if(!userId){
            return res.status(400).json({message: "userId is missing."});
        }

        const user = await User.findById(userId).populate("connections", "name username profilePicture headline connections");

        res.status(200).json(user.connections);
    } catch (error) {
        console.error("Error in getUserConnections controller: ", error);
        res.status(500).json({message: "server error"});
    }
}

export const removeConnection = async (req, res)=>{
    try {
        const myId = req.user._id;
        const {userId} = req.params;

        if(!myId || !userId){
            return res.status(400).json({message: "myId or userId is missing."});
        }

        if(myId.toString() === userId){
            return res.status(400).json({message: "You cannot remove yourself from your connections."});
        }

        if(!req.user.connections.includes(userId)){
            return res.status(400).json({message: "You are not connected with this user."});
        }

        await User.findByIdAndUpdate(myId, {
            $pull: {connections: userId},
        });
        await User.findByIdAndUpdate(userId, {
            $pull: {connections: myId},
        });

        res.status(200).json({message: "Connection removed successfully."});
        
    } catch (error) {
        console.error("Error in removeConnection controller: ", error);
        res.status(500).json({message: "server error"});
    }
}


export const getConnectionStatus = async (req, res)=>{
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.user._id;

        const currentUser = req.user;
        if(currentUser.connections.includes(targetUserId)){
            return res.json({status: "connected"});
        }

        const pendingRequest = await ConnectionRequest.findOne({
            $or: [
                {sender: currentUserId, recipient: targetUserId},
                {sender: targetUserId, recipient: currentUserId}
            ],
            status: "pending",
        })

        if(pendingRequest){
            if(pendingRequest.sender.toString() === currentUserId.toString()){
                return res.json({status: "pending"});
            }else{
                return res.json({status: "received", requestId: pendingRequest._id});
            }
        }

        // if no connection or pending req find
        res.json({status: "not_connected"});

    } catch (error) {
        console.error("Error in getConnectionStatus controller: ", error);
        res.status(500).json({message: "server error"});
    }
}