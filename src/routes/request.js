const express = require("express");

const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const isTouserExist = await User.findById(toUserId);

      if (!isTouserExist)
        res.status(404).json({ message: "User is not exist" });

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status))
        res.status(400).json({ message: "Invalid status type: " + status });

      //   if there is an existing ConnectionRequest

      const existingConnectRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        //   { fromUserId, fromUserId },
        ],
      });

      if (existingConnectRequest) {
        res.status(400).json({ message: "Connection Request Already Exist" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: req.user.firstName+" is "+status+" in/by "+isTouserExist.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
