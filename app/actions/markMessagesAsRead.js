"use server";
import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

const markMessageAsRead = async (messageId) => {
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
  const message = await Message.findById(messageId);
  if (!message) {
    throw new Error("Message not found");
  }
  if (message.recipient.toString() !== userId) {
    throw new Error("You are not authorized to read this message");
  }
  message.read = !message.read;
  revalidatePath("/messages", "page");
  await message.save();
  return message.read;
};

export default markMessageAsRead;
