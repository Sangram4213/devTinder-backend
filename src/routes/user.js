const express = require("express");
const { userAuth } = require("../middlewares/auth");

const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Get all the pending request connections
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    if (!connectionRequest)
      res.status(400).json({ message: "There is no any request" });

    res.json({ message: "Data fetched successfully", connectionRequest });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => { 
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

      const data = connectionRequest.map((row) => {
        if (row.fromUserId._id.toString() === loggedInUser._id.toString())
          return row.toUserId;
        return row.fromUserId;
      });

    res.json({ data });
  } catch (err) {
    res.status(400).send("Error: ", err.message);
  }
});

module.exports = userRouter;
