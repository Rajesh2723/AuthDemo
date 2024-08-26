const bcrypt=require('bcrypt');

const hashPassword=async (pw)=>{
    const salt=await bcrypt.genSalt(17);
    const hash=await bcrypt.hash(pw,salt);
    console.log(salt);
    console.log(hash);
}
const login=async (pw,hashedPw)=>{
    const result=await bcrypt.compare(pw,hashedPw);
    if(result){
        console.log("Logged you in successfully!!");
    }else{
        console.log("INCORRECT");
    }
}

login('monkey','$2b$17$sSZIcKp5CzByf3Vg.Uiw/eXDlh8O7/.e7jCfqtwFx4mMAk8URCwEO');//logged in successfully
// hashPassword('monkey');