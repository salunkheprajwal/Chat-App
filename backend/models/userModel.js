const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const userschema = mongoose.Schema(
    {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    pic: { type: String,  default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg", },
     
},
    { timestamps: true }
);

userschema.methods.matchPassword = async function name(enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
    
    
}

userschema.pre('save', async function (next) {
    if (!this.isModified) {
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
});


const User = mongoose.model("User", userschema);

module.exports = User;

