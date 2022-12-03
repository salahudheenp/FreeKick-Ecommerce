var db = require("../config/connection");
var collection = require("../config/collections");
const collections = require("../config/collections");
const { response } = require("../app");

const ObjectId = require("mongodb").ObjectID

exports.addProductOffer=(offer)=>{
    console.log(offer,'koooooooooooooooooooooiiiiiiiiiiiiiiii');
    let prodId=ObjectId(offer.product)
    let offerPercentage=Number(offer.productOffer)

    return new Promise(async (resolve, reject) => {
        db.get().collection(collections.PRODUCT_COLLECTION).updateOne(
            {
                _id:prodId
            },
            {
                $set:{
                    productOffer:offerPercentage
                }
            }
        )
        let product=await db.get().collection(collections.PRODUCT_COLLECTION).findOne(
            {
                _id:prodId
            }
        )
        if(product.productOffer >= product.categoryOffer){
            let temp =(product.price * product.productOffer)/100
            let updatedOfferPrice=(product.price-temp)
            let updatedProduct=await db.get().collection(collections.PRODUCT_COLLECTION).updateOne(
                {
                    _id:prodId
                },
                {
                    $set:{
                        offerPrice:updatedOfferPrice,
                        currentOffer: product.productOffer
                    }
                }

            )
            resolve(updatedProduct)
        }else if(product.offerPrice<product.categoryOffer){
            let temp=(product.price*product.productOffer)/100
            let updatedOfferPrice=(product.price-temp)
            let updatedProduct=await db.get().collection(collections.PRODUCT_COLLECTION).updateOne(
                {
                    _id:prodId
                },
                {
                    $set:{
                        offerPrice:updatedOfferPrice,
                        currentOffer: product.categoryOffer
                    }
                }
            )
            resolve(updatedProduct)
        }
        resolve()
    })
}

// get product offer

exports.getProductOffer=()=>{
    return new Promise((resolve, reject) => {
        let productOffer = db.get().collection(collections.PRODUCT_COLLECTION).aggregate(
            [
                {
                    '$match': {
                        'productOffer': {
                            '$gt': 0
                        }
                    }
                }, {
                    '$project': {
                        'product': 1,
                        'name': 1,
                        'productOffer': 1
                    }
                }
            ]
        ).toArray()
        resolve(productOffer)
    
    })
}

// delete product offer

exports.deleteProductOffer=(prodId,product)=>{
    return new Promise((resolve, reject) => {
        db.get().collection(collections.PRODUCT_COLLECTION).updateOne(
            {
                _id:ObjectId(prodId)
            },
            {
                $set:{
                    productOffer:0
                }
            }
        ).then((response)=>{
            db.get().collection(collections.PRODUCT_COLLECTION).findOne(
                {
                    _id:ObjectId(prodId)

                }
            ).then(async (response)=>{
                if(response.productOffer==0 && response.categoryOffer){
                    response.offerPrice= response.price
                    db.get().collection(collections.PRODUCT_COLLECTION).updateOne(
                        {
                            _id:ObjectId(prodId)
                        },
                        {
                            $set:{
                                offerPrice:response.offerPrice,
                                price:response.price,
                                currentOffer:0
                            }
                        }
                    )
                }else if(product.productOffer < product.categoryOffer){
                    let temp=(product.price*product.categoryOffer)/100
                    let updatedOfferPrice=(product.price-temp)
                    let updatedProduct=await db.get().collection(collections.PRODUCT_COLLECTION).updateOne({
                        _id:prodId
                    },
                    {
                        $set:{
                            offerPrice:updatedOfferPrice,
                            price:0,
                            currentOffer:product.categoryOffer
                        }

                    })
                    resolve(updatedProduct)
                }
            })
            resolve()
        })
    })
}

// add category offer

exports.addCategoryOffer=(offer)=>{
  let category=offer.category
  let offerPercentage=Number(offer.categoryOffer)
  return new Promise(async (resolve, reject) => {
     db.get().collection(collections.CATEGORY_COLLECTION).updateOne(
        {
            category:category
        },
        {
            $set:{
                categoryOffer:offerPercentage
            }
        }
    )
    await db.get().collection(collections.PRODUCT_COLLECTION).updateMany(
        {
            category:category
        },
        {
            $set:{
                categoryOffer:offerPercentage
            }
        }
    )
    let products=await db.get().collection(collections.PRODUCT_COLLECTION).find({
        category:offer.category
    }).toArray()
    console.log(products,'hoooooooooooooooooooooooooooooooooooooooooooi');
    for(let i=0;i < products.length;i++){
        if(products[i].categoryOffer >= products[i].productOffer){
            let temp=(products[i].price*products[i].categoryOffer)/100
            let updatedOfferPrice=(products[i].price-temp)
            db.get().collection(collections.PRODUCT_COLLECTION).updateOne(
                {
                    _id:ObjectId(products[i]._id)
                },
                {
                    $set:{
                        offerPrice:updatedOfferPrice,
                        currentOffer:products[i].categoryOffer
                    }
                }
            )
            console.log('afiuuidasoiuiouoiuiuo');
        }else if(products[i].categoryOffer < products[i].productOffer){
            let temp=(products[i].price*products.productOffer)/100
            let updatedOfferPrice=(products[i].price-temp)
            db.get().collection(collections.PRODUCT_COLLECTION).updateOne({
                _id:ObjectId(products[i]._id)
            },{
                $set:{
                    offerPrice:updatedOfferPrice,
                    currentOffer:products[i].productOffer
                }
            })
            console.log('afiuuidasoiuiouoiuiuo858585858585858585');

        }

    }
    resolve()
  })
}

//get category offer
exports.getCategoryOffer=()=>{
    return new Promise(async (resolve, reject) => {
        let categoryOffer=await db.get().collection(collections.CATEGORY_COLLECTION).find(
            {
                categoryOffer:{$gt:0}
            }
        ).toArray()
        resolve(categoryOffer)
    })
}

// delete Categry Offer

exports.deleteCategoryOffer=(category)=>{
    return new Promise((resolve, reject) => {
        db.get().collection(collections.CATEGORY_COLLECTION).updateOne(
            {
                category:category
            },
            {
                $set:{
                    categoryOffer:0
                }
            }
        )
        db.get().collection(collections.PRODUCT_COLLECTION).updateMany(
            {
                category:category
            },
            {
                $set:{
                    categoryOffer:0

                }
            }
        ).then(async(response)=>{
            let products=await db.get().collection(collections.PRODUCT_COLLECTION).find(
                {
                    category:category
                }
            ).toArray()
            for(i=0;i< products.length;i++){
                if(products[i].productOffer ==0 && products[i].categoryOffer==0){
                    products[i].offerPrice=products[i].price
                    db.get().collection(collections.PRODUCT_COLLECTION).updateOne(
                        {
                            _id:ObjectId(products[i]._id)

                        },
                        {
                            $set:{
                                offerPrice:products[i].offerPrice,
                                currentOffer:0

                            }
                        }
                    )
                }else if(products[i].categoryOffer<products[i].productOffer){
                    let temp=(products[i].price*products[i].productOffer)/100
                    let updatedOfferPrice=(products[i].price-temp)
                    db.get().collection(collections.PRODUCT_COLLECTION).updateOne(
                        {
                            _id:ObjectId(products[i]._id)
                        },
                        {
                            $set:{
                                offerPrice:updatedOfferPrice,
                                currentOffer:products[i].productOffer
                            }
                        }
                    )
                }
            }
        })
        resolve()
    })
}