import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/config/database";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    //Invoked when a user is authenticated
    async signIn({ profile }) {
      //1. Connect to your database
      await connectDB();
      //2. Check if the user already exists
      const userExists = await User.findOne({
        email: profile.email,
      });
      //3. If not create a new user
      if (!userExists) {
        const username = profile.name.slice(0, 20);
        await User.create({
          username,
          email: profile.email,
          image: profile.picture,
        });
      }
      //4. Return true to allow sign in
      return true;
    },
    //Session callback fn that modifies the session object
    async session({ session }) {
      //1. Get user from database
      const user = await User.findOne({ email: session.user.email });
      //2. Assign user id to session object
      session.user.id = user._id.toString(); 
      //3. Return session object
      return session;
    },
  },
};
