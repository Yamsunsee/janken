import { Router } from "express";
import {
  signUp,
  signIn,
  getInvitations,
  addInvitations,
  removeInvitations,
  getFriends,
  addFriends,
  removeFriends,
} from "../modules/User/handler.js";

const usersRoute = Router();

usersRoute.post("/signup", signUp);
usersRoute.post("/signin", signIn);

usersRoute.get("/:userId/invitations", getInvitations);
usersRoute.patch("/:userId/invitations", addInvitations);
usersRoute.delete("/:userId/invitations/:recipientId", removeInvitations);

usersRoute.get("/:userId/friends", getFriends);
usersRoute.patch("/:userId/friends", addFriends);
usersRoute.delete("/:userId/friends/:recipientId", removeFriends);

export default usersRoute;
