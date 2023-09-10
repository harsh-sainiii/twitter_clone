import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, require: true },
  username: { type: String, require: true, unique: true },
  name: { type: String, require: true },
  image: String,
  bio: String,
  tweets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },
  ],
  onboard: {
    type: Boolean,
    default: false,
  },
  communities: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
