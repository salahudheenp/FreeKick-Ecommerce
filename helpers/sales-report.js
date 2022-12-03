var db = require("../config/connection");
var collection = require("../config/collections");
const collections = require("../config/collections");
const { response } = require("../app");

const ObjectId = require("mongodb").ObjectID

//SALES REPORT
exports.deliverdOrderList= (yy, mm) => {
    return new Promise(async (resolve, reject) => {
        // let agg = [{
        //     $match: {
        //         'status': 'delivered'
        //     }
        // }, {
        //     $unwind: {
        //         path: '$products'
        //     }
        // }, {
        //     $project: {
        //         totalAmount: 1,
        //         status:'$products.product.status',
        //         productPrice: '$products.product.offerPrice',
        //         statusUpdateDate: 1,
        //         paymentMethod: '$paymentMethod'
        //     }
        // }]
        let agg = [
            {
                '$unwind': {
                    'path': '$products'
                }
            }, {
                '$project': {
                    'totalAmount': 1,
                    'status': '$products.status',
                    'productPrice': '$products.product.offerPrice',
                    'statusUpdateDate': 1,
                    'stausUpdatedisplayDate':1,
                    'paymentMethod': '$paymentMethod',
                    'products': '$products.product'
                }
            }, {
                '$match': {
                    'status': 'delivered'
                }
            }
        ]
        if (mm) {
            let start = "1"
            let end = "30"
            let fromDate = mm.concat("/" + start + "/" + yy)
            let fromD = new Date(new Date(fromDate).getTime() + 3600 * 24 * 1000)

            let endDate = mm.concat("/" + end + "/" + yy)
            let endD = new Date(new Date(endDate).getTime() + 3600 * 24 * 1000)
            dbQuery = {
                $match: {
                    statusUpdateDate: {
                        $gte: fromD,
                        $lte: endD
                    }
                }
            }
            agg.unshift(dbQuery)
            
            let deliveredOrders = await db
                .get()
                .collection(collections.ORDER_COLLECTION)
                .aggregate(agg).toArray()
            resolve(deliveredOrders)
        } else if (yy) {
            let dateRange = yy.daterange.split("-")
            let [from, to] = dateRange
            from = from.trim("")
            to = to.trim("")
            fromDate = new Date(new Date(from).getTime() + 3600 * 24 * 1000)
            toDate = new Date(new Date(to).getTime() + 3600 * 24 * 1000)
            dbQuery = {
                $match: {
                    statusUpdateDate: {
                        $gte: fromDate,
                        $lte: toDate
                    }
                }
            }
            agg.unshift(dbQuery)
            let deliveredOrders = await db
                .get()
                .collection(collections.ORDER_COLLECTION)
                .aggregate(agg).toArray()
            resolve(deliveredOrders)
        } else {
            let deliveredOrders = await db
                .get()
                .collection(collections.ORDER_COLLECTION)
                .aggregate(agg).toArray()
            resolve(deliveredOrders)
            // console.log(deliveredOrders, '5555555555555555555555555555555544444444444444444444444444');
        }
        
    })
}

    //TOTAL AMOUNT OF DELIVERED PRODUCTS
exports. totalAmountOfdelivered=() => {
        return new Promise(async (resolve, reject) => {
            let amount = await db.get().collection(collections.ORDER_COLLECTION).aggregate([
                {
                    '$match': {
                        'products.status': 'delivered'
                    }
                }, {
                    '$group': {
                        '_id': null,
                        'total': {
                            '$sum': '$totalAmount'
                        }
                    }
                }
            ]).toArray()
            resolve(amount[0]?.total)
        })
    }


