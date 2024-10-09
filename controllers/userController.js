const userModel = require("../models/userModel")
const bcrypt = require("bcryptjs")
//get user info
const getUserController = async (req, res) => {
    try {
        //find user
        const user = await userModel.findById({_id:req.body.id})

        //validation
        if (!user) {
            return res.status(404).send({
                success:false,
                message: "User not found"
            })
        }
        //hide password
        user.password = undefined
        //send response
        res.status(200).send({
            success:true,
            message:'User get Successfully',
            user,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: 'Internal Server Error Get User API',
            error
        })
    }
}

//update user
const updateUserController = async (req, res) => {
    try {
        //find user
        const user = await userModel.findById({_id:req.body.id})
        //validation
        if (!user) {
            return res.status(404).send({
                success:false,
                message: "User not found"
            })
        }
        //update user
        const {userName,address,phone} = req.body
        if (userName) user.userName = userName
        if (address) user.address = address
        if (phone) user.phone = phone
        //save user
        await user.save()
        //send response
        res.status(200).send({
            success:true,
            message:'User update Successfully',
            user,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: 'Internal Server Error Update User API',
        })
    }
}

//update user password
const updatePasswordController = async (req, res) => {
    try {
        //find user
        const user = await userModel.findById({_id:req.body.id})
        //validation
        if (!user) {
            return res.status(404).send({
                success:false,
                message: "User not found"
            })
        }
        //get data from user
        const {oldPassword, newPassword} = req.body
        //validation
        if (!oldPassword || !newPassword) {
            return res.status(500).send({
                success:false,
                message: "Old password and new password are required"
            })
        }
        //check user password || compare password
        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: 'Invalid Credentials'
            })
        }
        //hashing password
        var salt = bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        user.password = hashedPassword
        await user.save()
        res.status(200).send({
            success: true,
            message: 'User password update Successfully',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: 'Internal Server Error Update User Password API',
            error
        })
    }
}

//reset user password
const resetPasswordController = async (req, res) => {
    try {
        const {email, newPassword, answer} = req.body
        if (!email || !newPassword || !answer) {
            return res.status(500).send({
                success: false,
                message: "Email, New Password and Answer are required"
            })
        }
        const user = await userModel.findOne({email,answer})
        if (!user) {
            return res.status(500).send({
                success: false,
                message: 'User not found or Invalid answer'
            })
        }
        //hashing password
        var salt = bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt) 
        user.password = hashedPassword       
        await user.save()
        res.status(200).send({
            success: true,
            message: 'User password reset Successfully',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: 'Internal Server Error Reset User Password API',
            error
        })
    }
}

//delete user profile
const deleteProfileController = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id)
        res.status(200).send({
            success: true,
            message: 'User Profile Deleted Successfully',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: 'Internal Server Error Delete User Profile API',
            error
        })
    }
}

module.exports = {getUserController, updateUserController, updatePasswordController, resetPasswordController, deleteProfileController}