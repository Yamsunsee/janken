import argon2 from "argon2";
import User from "./schema.js";

const { hash, verify } = argon2;

const signUp = async (req, res) => {
  try {
    const { name, password } = req.body;
    const isDuplicatedName = await User.findOne({ name });
    if (isDuplicatedName) {
      return res.status(400).json({ isSuccess: false, message: "Username has been taken!" });
    }
    const hashedPassword = await hash(password);
    const newUser = new User({
      name,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ isSuccess: false, message: "Wrong username!" });
    }
    const isValidPassword = await verify(user.password, password);
    if (isValidPassword) {
      const { _id, name } = user;
      return res.status(200).json({ isSuccess: true, message: "Successfully!", data: { _id, name } });
    } else {
      return res.status(400).json({ isSuccess: false, message: "Wrong password!" });
    }
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

const getFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("friends", "name");
    return res.status(200).json({ isSuccess: true, message: "Successfully!", data: user.friends });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

const addFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const { recipientId } = req.body;
    await User.findByIdAndUpdate(recipientId, {
      $addToSet: { friends: userId },
    });
    await User.findByIdAndUpdate(recipientId, {
      $pull: { pendingRequests: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $addToSet: { friends: recipientId },
    });
    await User.findByIdAndUpdate(userId, {
      $pull: { pendingRequests: recipientId },
    });
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

const removeFriends = async (req, res) => {
  try {
    const { userId, recipientId } = req.params;
    await User.findByIdAndUpdate(recipientId, {
      $pull: { friends: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $pull: { friends: recipientId },
    });
    return res.status(200).json({ isSuccess: true, message: "Deleted!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

const getInvitations = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("pendingRequests", "name");
    return res.status(200).json({ isSuccess: true, message: "Successfully!", data: user.pendingRequests });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

const addInvitations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name } = req.body;
    const recipient = await User.findOne({ name });
    if (!recipient) return res.status(400).json({ isSuccess: false, message: "Wrong friend's name" });
    await User.findByIdAndUpdate(recipient._id, {
      $addToSet: { pendingRequests: userId },
    });
    return res.status(200).json({ isSuccess: true, message: "Successfully!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

const removeInvitations = async (req, res) => {
  try {
    const { userId, recipientId } = req.params;
    await User.findByIdAndUpdate(userId, {
      $pull: { pendingRequests: recipientId },
    });
    return res.status(200).json({ isSuccess: true, message: "Deleted!" });
  } catch (error) {
    return res.status(400).json({ isSuccess: false, message: error.message });
  }
};

export { signUp, signIn, getFriends, addFriends, removeFriends, getInvitations, addInvitations, removeInvitations };
