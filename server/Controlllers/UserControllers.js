
const User = require("../model/UserModel")
const bcrypt = require('bcrypt')

module.exports.register=async (req,res,next)=>{
  try{
    const {username, email,password} =req.body
    const usernameCheck = await User.findOne({username})

    if(usernameCheck){
      console.log("Username already exists");
      return res.json({msg: "Username already used",status:false})

    }
    const emailCheck=await User.findOne({email})
    if(emailCheck){
      console.log("Email already exists");
      return res.json({msg:"EMail laready used",status:false})

    }

    const hashedPassword = await bcrypt.hash(password,10)
    const user = await User.create({
      email,
      username,
      password:hashedPassword
    })
    delete user.password
    return res.json({status:true,user})
  }
  catch(e){
    next(e)
  }
}







module.exports.login=async (req,res,next)=>{
  try{
    const {username,password} =req.body
    const user = await User.findOne({username})

    if(!user){
      console.log("Username not found");
      return res.json({msg: "Icorrect Username or password",status:false})

    }

    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
      return res.json({msg: "Icorrect Username or password",status:false})

    }
    delete user.password
    
    return res.json({status:true,user})
  }
  catch(e){
    next(e)
  }
}







module.exports.setAvatar = async (req, res) => {
  const userId = req.params.id;
  const avatarImage = req.body.image;

  try {
    const user = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      isSet: user.isAvatarImageSet,
      image: user.avatarImage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};






module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    console.error('Error fetching all users:', ex);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
