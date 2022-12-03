var db = require("../config/connection");
var collection = require("../config/collections");
const collections = require("../config/collections");
const { response } = require("../app");

const ObjectId = require("mongodb").ObjectID

const moment = require('moment')


//DASHBOARD COUNT
exports.dashboardCount= (days) => {
    days = parseInt(days)
    return new Promise(async (resolve, reject) => {
        let startDate = new Date();
        let endDate = new Date();
        startDate.setDate(startDate.getDate() - days)

        let data = {};

        data.deliveredOrders = await db.get().collection(collections.ORDER_COLLECTION).find({
            date: { $gte: startDate, $lte: endDate }, 'products.status': 'delivered'
        }).count()
        data.shippedOrders = await db.get().collection(collections.ORDER_COLLECTION).find({ date: { $gte: startDate, $lte: endDate }, 'products.status': 'shipped' }).count()
        data.placedOrders = await db.get().collection(collections.ORDER_COLLECTION).find({ date: { $gte: startDate, $lte: endDate }, 'products.status': 'placed' }).count()
        data.pendingOrders = await db.get().collection(collections.ORDER_COLLECTION).find({ date: { $gte: startDate, $lte: endDate }, 'products.status': 'pending' }).count()
        data.canceledOrders = await db.get().collection(collections.ORDER_COLLECTION).find({ date: { $gte: startDate, $lte: endDate }, 'products.status': 'canceled' }).count()
        data.returnedOrders = await db.get().collection(collections.ORDER_COLLECTION).find({ date: { $gte: startDate, $lte: endDate }, 'products.status': 'returned' }).count()
        data.cod=await db.get().collection(collections.ORDER_COLLECTION).find({paymentMethod:'cod'}).count()
        
        let codTotal = await db.get().collection(collections.ORDER_COLLECTION).aggregate([
            {
                $match: {
                    date: {
                        $gte: startDate, $lte: endDate
                    },
                    paymentMethod: 'cod'
                },
            },
            {
                     '$unwind': {
                         'path': '$products'
                              }
             },
                
            {
                     '$project': {
                         'totalPrice': '$products.product.offerPrice'
                     }
                 }, {
                '$group': {
                    _id: null,
                    'totalPrice': {
                        '$sum': '$totalPrice'
                    }
                }
                 }
        ]).toArray()
        data.codTotal = codTotal?.[0]?.totalPrice
        let onlineTotal = await db.get().collection(collections.ORDER_COLLECTION).aggregate([
            {
                $match: {
                    date: {
                        $gte: startDate, $lte: endDate
                    },
                    paymentMethod: 'razorpay'
                },
            },
            {
                '$unwind': {
                    'path': '$products'
                }
            },

            {
                '$project': {
                    'totalPrice': '$products.product.offerPrice'
                }
            }, {
                '$group': {
                    _id: null,
                    'totalPrice': {
                        '$sum': '$totalPrice'
                    }
                }
            }
        ]).toArray()
        
        data.onlineTotal = onlineTotal?.[0]?.totalPrice
        let totalAmount = await db.get().collection(collections.ORDER_COLLECTION).aggregate([
            {
                $match: {
                    date: {
                        $gte: startDate, $lte: endDate
                    },
                },
            },
            {
                '$unwind': {
                    'path': '$products'
                }
            },

            {
                '$project': {
                    'totalPrice': '$products.product.offerPrice'
                }
            }, {
                '$group': {
                    _id: null,
                    'totalPrice': {
                        '$sum': '$totalPrice'
                    }
                }
            }
        ]).toArray()
        data.totalAmount = totalAmount[0]?.totalPrice
        resolve(data)
        console.log(data,'************************()()');
    })
}


// dashbord


// exports.dashboardTotalAmount= () => {
//     return new Promise(async (resolve, reject) => {
//         let totalRevenue = await db
//             .get()
//             .collection(collections.ORDER_COLLECTION)
//             .aggregate([
//                 {
//                     '$unwind': {
//                         'path': '$products'
//                     }
//                 }, {
//                     '$match': {
//                         'products.status': 'delivered'
//                     }
//                 }, {
//                     '$project': {
//                         'totalPrice': '$products.product.offerPrice'
//                     }
//                 }, {
//                     '$group': {
//                         '_id': null,
//                         'totalPrice': {
//                             '$sum': '$totalPrice'
//                         }
//                     }
//                 }
//             ])
//             .toArray();
//         totalRevenue = totalRevenue[0].totalPrice;
//         console.log(totalRevenue,'()()()()()()()()()()()()()()()()()()()()()()');
//         resolve(totalRevenue);
//     });
// },
//  exports.dashboardTotalOrder= () => {
//         return new Promise(async (resolve, reject) => {
//             let totalOrder = await db
//                 .get()
//                 .collection(collections.ORDER_COLLECTION)
//                 .countDocuments();
//             resolve(totalOrder);
//         });
//     },
//        exports.dashboardTotalUsers =async () => {
//             return new Promise(async (resolve, reject) => {
//                 let totalUsers = await db
//                     .get()
//                     .collection(collections.USER_COLLECTION)
//                     .countDocuments();
//                 resolve(totalUsers);
//             });
//         },
//             exports.dashboardChartData= () => {
//                 return new Promise(async (resolve, reject) => {
//                     let chartData = {};

//                     chartData.delivered = await db
//                         .get()
//                         .collection(collections.ORDER_COLLECTION)
//                         .find({ 'products.status': 'delivered' })
//                         .count();
//                     chartData.shipped = await db
//                         .get()
//                         .collection(collections.ORDER_COLLECTION)
//                         .find({ 'products.status': 'shipped' })
//                         .count();
//                     chartData.placed = await db
//                         .get()
//                         .collection(collections.ORDER_COLLECTION)
//                         .find({ 'products.status': 'placed' })
//                         .count();
//                     chartData.pending = await db
//                         .get()
//                         .collection(collections.ORDER_COLLECTION)
//                         .find({ 'products.status': 'pending' })
//                         .count();
//                     chartData.canceled = await db
//                         .get()
//                         .collection(collections.ORDER_COLLECTION)
//                         .find({ 'products.status': 'canceled' })
//                         .count();
//                     console.log(chartData);
//                     resolve(chartData);
//                 });
//             },
//                exports. dashboardPieChart= () => {
//                     return new Promise(async (resolve, reject) => {
//                         let pieChart = {};

//                         pieChart.cod = await db
//                             .get()
//                             .collection(collections.ORDER_COLLECTION)
//                             .find({ paymentMethod: "cod" })
//                             .count();
//                         pieChart.razorpay = await db
//                             .get()
//                             .collection(collections.ORDER_COLLECTION)
//                             .find({ paymentMethod: "razorpay" })
//                             .count();
//                         pieChart.paypal = await db
//                             .get()
//                             .collection(collections.ORDER_COLLECTION)
//                             .find({ paymentMethod: "paypal" })
//                             .count();
    

//                         console.log(pieChart);
//                         resolve(pieChart);
//                     });
//                 }