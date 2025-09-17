import { model, models, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    title: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true },
);

const User = models.User || model("User", userSchema);

export default User;
