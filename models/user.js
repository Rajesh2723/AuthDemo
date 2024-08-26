const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Username cannot be blank']
    },
    password:{ //hashed password
        type:String,
        required:[true,'PassWord cannot be blank']
    }
})

userSchema.statics.findAndValidate=async function(username,password){
    const foundUser=await this.findOne({username});
    const isValid=await bcrypt.compare(password,foundUser.password);
    return isValid?foundUser:false;
}

module.exports=mongoose.model('User',userSchema);
//Schema got created of user