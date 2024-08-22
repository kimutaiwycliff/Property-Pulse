'use server';
import connectDB from "@/config/database";
import cloudinary from "@/config/cloudinary";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

const deleteProperty = async (propertyId) => {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }
  const { userId } = sessionUser;
  await connectDB();
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new Error("Property not found");
  }
  if (property.owner.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  //Extract publicID from images and delete from cloudinary
  const publicIds = property.images.map((imageUrl) => {
    const parts = imageUrl.split("/");
    return parts.at(-1).split(".")[0];
  });

  if (publicIds.length > 0) {
    for (let publicId of publicIds) {
      await cloudinary.uploader.destroy(
        "PropertyPulse" + publicId
      );
    }

    await property.deleteOne();
    revalidatePath("/", 'layout');
  }
};

export default deleteProperty;