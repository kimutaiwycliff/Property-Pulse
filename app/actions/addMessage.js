"use server";
import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

const addMessage = async (formData) => {
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
  const recipient = formData.get("recipient");
  
  if (userId === recipient) {
    throw new Error("You cannot send a message to yourself");
  }
const newMessage = new Message({
    sender: userId,
    recipient,
    property: formData.get("property"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
});
await newMessage.save();
return {
    submitted: true,
}
}

export default addMessage;
