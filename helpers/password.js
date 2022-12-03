var db = require("../config/connection");
var collections = require("../config/collections");
const bcrypt = require("bcrypt");
const { response } = require("../app");
const ObjectId = require("mongodb").ObjectID 


module.exports={
    //OTP LOGIN
    otpLogin: (userData) => {

console.log(userData,"***********************************");

        let response = {};
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({ phone: userData.phone })
            console.log(user,'userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
            if (user) {
                console.log('otpverfuy');
                response.user = user;
                response.status = true;
                resolve(response);
            } else {
                console.log('Login Failed');
                reject({ status: false })
            }
        }
        )
    },


    postNewPassword:(data,userId)=>{
        
        return new Promise(async (resolve, reject) => {
            if(data.password===data.cpassword){
                let password = await bcrypt.hash(data.password, 10)
                db.get().collection(collections.USER_COLLECTION).updateOne(
                    {
                        _id:ObjectId(userId)
                    },{
                        $set:{
                            password:password
                        }
                    }
                ).then((response)=>{
                    resolve(response)
                })

            }else{
                let err="Your Password Not Mach"
                reject(err)
            }
        })
    },

   resendOtp: (phone) => {

        console.log(phone, "***********************************");

        let response = {};
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({ phone:phone })
            console.log(user, 'userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
            if (user) {
                console.log('otpverfuy');
                response.user = user;
                response.status = true;
                resolve(response);
            } else {
                console.log('Login Failed');
                reject({ status: false })
            }
        }
        )

}
}