import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  image: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
      //  reference to it self (recursion)
      //  meaning one tweet could have multiple children
      //  and the children can have a children

      // LOGIC
      //-> Tweet Person (A) Parent (A)
      //    -> Tweet Person (B) Children (A)
      //    -> Tweet Person (C) Children (A) & Parent (C)
      //       -> Tweet Person (B) Children (C)
      //       -> Tweet Person (C) Children (C)
      //       -> Tweet Person (A) Children (C) & Parent (A)
      //           -> Tweet Person (E) Children (A)
      //           -> Tweet Person (F) Children (A)
      //           -> Tweet Person (G) Children (A)
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Tweet = mongoose.models.Tweet || mongoose.model("Tweet", tweetSchema);

export default Tweet;
