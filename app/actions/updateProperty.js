"use server";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const updateProperty = async (propertyId, formData) => {
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
  const existingProperty = await Property.findById(
    propertyId
  );
  if (!existingProperty) {
    throw new Error("Property not found");
  }
  if (existingProperty.owner.toString() !== userId) {
    throw new Error(
      "Current user is not the owner of this property"
    );
  }
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
    amenities: formData.getAll("amenities"),
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
  const updatedProperty = await Property.findByIdAndUpdate(
    propertyId,
    propertyData
  );
  revalidatePath("/", "layout");
  redirect(`/properties/${updatedProperty._id}`);
};

export default updateProperty;
