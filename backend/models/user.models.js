import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    picture : {
        type : String,
        default : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }

},{
    timestamps : true
})

userSchema.pre("save", async function(next){
    if(!this.isModified('password')){
        return next()
    }


    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = function (){
    const token  = jwt.sign({
        _id : this._id,
        email : this.email
    },process.env.JWT_SECRET_KEY,{
        expiresIn : process.env.JWT_SECRET_KEY_EXPIRY
    })

    console.log(token);

    return token
    
}


const User = mongoose.model('User',userSchema)

export default User