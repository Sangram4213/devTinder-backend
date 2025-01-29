const express = require("express");

const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');

requestRouter.post("/sendConnectionRequest",userAuth,(req,res)=>{
    res.send("Connection Request Sent!"); 
})

module.exports=requestRouter;