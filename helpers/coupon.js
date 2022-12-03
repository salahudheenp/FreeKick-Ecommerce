var db = require("../config/connection");
var collection = require("../config/collections");
const collections = require("../config/collections");
const { response } = require("../app");

const ObjectId = require("mongodb").ObjectID
const moment = require('moment')


module.exports={

    //ADD COUPON
    addCoupon: (data) => {
        data.coupon = data.coupon.toUpperCase()
        data.couponOffer = Number(data.couponOffer)
        data.minPrice = Number(data.minPrice)
        data.maxPrice = Number(data.maxPrice)
        data.expDate = (data.expDate)
        data.user = []
        return new Promise(async (resolve, reject) => {
            let couponCheck = await db.get().collection(collections.COUPON_COLLECTION).findOne({ coupon: data.coupon })
            if (couponCheck == null) {
                db.get().collection(collections.COUPON_COLLECTION).insertOne(data).then((response) => {
                    resolve()
                })
            } else {
                console.log('Rejected');
                reject()
            }
        })
    },

    //GET COUPONS
    getCoupon: () => {
        return new Promise(async (resolve, reject) => {
            let coupons = await db.get().collection(collections.COUPON_COLLECTION).find({}).toArray()
            resolve(coupons)
        })
    },

    //DELETE COUPON
    deleteCoupon: (data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.COUPON_COLLECTION).deleteOne({ coupon: data })
            resolve(response)
        })
    },
// redeem coupon
    redeemCoupon: (couponDetails,userId) => {
        let couponName = couponDetails.coupon.toUpperCase()
        
        console.log(couponName);
        return new Promise(async (resolve, reject) => {
            currentDate = moment().format('L')
            let userCheck = await db.get().collection(collections.COUPON_COLLECTION).findOne({ $and: [{ coupon: couponName },{ user:userId }] })
            console.log(userCheck,userId,"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
               
            
            let couponCheck = await db.get().collection(collections.COUPON_COLLECTION).findOne({ $and: [{ coupon: couponName }, { expDate: { $gte: currentDate } }] })
            console.log(couponCheck);
            if (couponCheck !== null&&userCheck === null) {
                resolve(couponCheck)
            } else {
                reject()
            }
        })
    },

    redeemUser: (couponName,userId)=>{
        console.log(userId,couponName);
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collections.COUPON_COLLECTION).updateOne({ coupon:couponName},
                {
                    $push: { user:userId }
                }
            )
            resolve()
        })
    },

    checkRedeemUser:(couponName,userId)=>{
        return new Promise(async (resolve, reject) => {


            await db.get().collection(collections.COUPON_COLLECTION).findOne({coupon:couponName,'user.':ObjectId(userId)}).then((response)=>{
                resolve(response)
                console.log(response);
            })
        })
    }


}