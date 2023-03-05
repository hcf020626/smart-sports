const express = require('express')

const userRouter = express.Router()

const {userRegHandler} = require('../router_handler/userRouterHandler')

userRouter.get('/userReg', userRegHandler)

exports.userRouter = userRouter