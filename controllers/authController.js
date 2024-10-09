const userModel = require("../models/userModel")
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')


//user registration
const registerController = async (req, res) => {

    try {
        const {userName, email, password, phone, address, answer} = req.body
        //validation
        if (!userName || !email || !password || !phone || !address ||  !answer) {
            return res.status(500).send({
                success: false,
                message: 'All fields are required'
            })
        }

        //existing user checking
        const user = await userModel.findOne({email}, {password:0})

        if (user) {
            return res.status(500).send({
                success:false,
                message:'Email Already Registerd Please Login'
            })
        }
        //hashing password
        var salt = bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        

        //create new user register
        const newUser = await userModel.create({userName, email, password:hashedPassword, address, phone, answer,})
        res.status(201).send({
            success: true,
            message: 'User Register Successfully',
            user:newUser,
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in User Registeration',
            error
        })
    }
}

//user login
const loginController = async (req, res) => {
    try {
        const {email,password} = req.body

        //validation
        if (!email || !password) {
            return res.status(500).send({
                success: false,
                message: 'Provide email or password'
            })
        }

        //existing user checking
        const user = await userModel.findOne({email})

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User Not Found'
            })
        }
        //check user password || compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: 'Invalid Credentials'
            })
        }

        //token
        const token = JWT.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '365d'})
        user.password = undefined
        res.status(200).send({
            success: true,
            message: 'Login Successfully',
            token,
            user,
        })

    } catch (error) {
        console.log(error) 
            res.status(500).send({
                success: false,
                message: 'Error in Login',
                error
            })
    }
}

module.exports = {registerController, loginController}