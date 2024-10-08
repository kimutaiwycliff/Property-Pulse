"use server";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/config/cloudinary";

const addProperty = async (formData) => {
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
  //Access all values from amenities and images
  const amenities = formData.getAll("amenities");
  const images = formData
    .getAll("images")
    .filter((image) => image !== "");
  const propertyData = {
    owner: userId,
    type: formData.get("type"),
    name: formData.get("name"),
    description: formData.get("description"),
    location: {
      street: formData.get("location.street"),
      city: formData.get("location.city"),
      state: formData.get("location.state"),
      zip: formData.get("location.zipcode"),
    },
    beds: formData.get("beds"),
    baths: formData.get("baths"),
    squareFeet: formData.get("square_feet"),
    amenities,
    rates: {
      weekly: formData.get("rates.weekly"),
      monthly: formData.get("rates.monthly"),
      nightly: formData.get("rates.nightly"),
    },
    seller_info: {
      name: formData.get("seller_info.name"),
      email: formData.get("seller_info.email"),
      phone: formData.get("seller_info.phone"),
    },
  };
  //Upload images to Cloudinary
  const imageUrls = [];
  for (const imageFile of images) {
    const imageBuffer = await imageFile.arrayBuffer();
    const imageArray = Array.from(
      new Uint8Array(imageBuffer)
    );
    const imageData =
      Buffer.from(imageArray).toString("base64");

    //Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(
      `data:image/png;base64,${imageData}`, {
        folder: "PropertyPulse",
      }
    );
    imageUrls.push(uploadedImage.secure_url);
  }
  propertyData.images = imageUrls;
  const newProperty = new Property(propertyData);
  await newProperty.save();
  revalidatePath("/", "layout");
  redirect(`/properties/${newProperty._id}`);
};
export default addProperty;
