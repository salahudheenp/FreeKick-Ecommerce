var db = require("../config/connection");
var collections=require("../config/collections")
const bcrypt = require("bcrypt");
const { Collection, ObjectId, ObjectID } = require("mongodb");
const moment = require('moment')

module.exports={
    doLogin:(adminData)=>{
        console.log(adminData,'apooooooooondtttooooooooooooooooooooo');
        return new Promise(async(resolve,reject)=>{
            let response = {}
            let loginStatus = false;
            
            let admin =await db.get().collection(collections.ADMIN_COLLECTION).findOne({ email: adminData.email })
            if (admin) {
                bcrypt.compare(adminData.password, admin.password).then((result) => {
                    if (result) {
                        console.log("admin heare");
                        response.admin = admin
                        response.status = true
                        resolve(response)

                    }else{
                        console.log("incrt pass");
                        response.status = false

                
                        resolve(response.status=false)
                    }
                })
            }else{
                console.log("no admin");
                resolve(response.status = false)

            }
        })
       

    }, 
    changeUserStatus:(userId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collections.USER_COLLECTION).updateOne({ _id: ObjectId(userId)},[{"$set":{status:{"$not":"$status"}}}]).then((response)=>{
                resolve(response)
            })
        })
    },
    getAllUsers:()=>{
        return new Promise((resolve, reject) => {
        let users= db.get().collection(collections.USER_COLLECTION).find({}).toArray()
            resolve(users)
        })
    },

    // order details
    getOrderDetails: (orderStatus)=>{
        return new Promise(async (resolve, reject) => {
            let orderItems = await db.get().collection(collections.ORDER_COLLECTION).find({}).sort({ date:-1 }).toArray()
            // .aggregate(
            //     [
            //         {
            //             '$unwind': {
            //                 'path': '$products'
            //             }
            //         }, {
            //             '$project': {
            //                 'item': '$products.item',
            //                 'quantity': '$products.quantity',
            //                 'deliveryDetails': '$deliveryDetails',
            //                 'paymentMethod': '$paymentMethod',
            //                 'totalAmount': '$totalAmount',
            //                 'status': '$status',
            //                 'date': '$date'
            //             }
            //         }, {
            //             '$lookup': {
            //                 'from': 'product',
            //                 'localField': 'item',
            //                 'foreignField': '_id',
            //                 'as': 'product'
            //             }
            //         }, {
            //             '$project': {
            //                 'item': 1,
            //                 'quantity': 1,
            //                 'product': {
            //                     '$arrayElemAt': [
            //                         '$product', 0
            //                     ]
            //                 },
            //                 'deliveryDetails': 1,
            //                 'paymentMethod': 1,
            //                 'totalAmount': 1,
            //                 'status': 1,
            //                 'date': 1
            //             }
            //         }
            //     ]
            // ).toArray()
            resolve(orderItems)
        })
    },

    //ORDER STATUS
    changeOrderStatus: (proId,orderId, status) => {
        console.log(proId,'999999999999999');
        return new Promise((resolve, reject) => {
            let dateStatus = new Date()
            let stausUpdatedisplayDate = moment().format('MMMM Do YYYY, h:mm:ss a')
            db.get().collection(collections.ORDER_COLLECTION).updateOne({ _id: ObjectID(orderId),'products.item':ObjectID(proId) },
                { $set: { 'products.$.status': status, statusUpdateDate: dateStatus, stausUpdatedisplayDate: stausUpdatedisplayDate } }).then(() => {
                    resolve()
                })
        })
    }, 
}
   
