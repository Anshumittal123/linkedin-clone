import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getMessages, getRecentConversations, getUnreadMessageCount,  getUsersForSidebar, 
markMessagesAsRead, 
sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/", protectRoute, getRecentConversations);
router.get("/users", protectRoute, getUsersForSidebar);
router.get("/unread/count", protectRoute, getUnreadMessageCount);
router.post("/send/:id", protectRoute, sendMessage);
router.put("/mark-as-read/:id", protectRoute, markMessagesAsRead);

router.get("/:id", protectRoute, getMessages);

export default router;