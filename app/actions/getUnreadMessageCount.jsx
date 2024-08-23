"use server";
import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

const getUnreadMessageCount = async () => {
  //Connect to the database
  await connectDB();
  //Get the user session
  const sessionUser = await getSessionUser();
  //Check if the user session exists
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }
  //Get user ID
  const { userId } = sessionUser;
  const count = await Message.countDocuments({
    recipient: userId,
    read: false,
  });
  return { count };
};

export default getUnreadMessageCount;
