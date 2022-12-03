var db = require("../config/connection");
var collections = require("../config/collections");
const bcrypt = require("bcrypt");
const { response } = require("../app");
const { LogContext } = require("twilio/lib/rest/serverless/v1/service/environment/log");
const ObjectId = require("mongodb").ObjectID 
const moment = require('moment')


module.exports = {
  doSignup: (userData) => {
    console.log(userData,'????????????????????????????????????????????????????????????????');
    return new Promise(async (resolve, reject) => {
      let emailChecking = await db.get().collection(collections.USER_COLLECTION).findOne({ email: userData.email })
      let phoneChecking=await db.get().collection(collections.USER_COLLECTION).findOne({phone:userData.phone})
      console.log(emailChecking,'<<<  >>>     <<<>>>   ',phoneChecking);
      if (emailChecking) {
        let emailErr = "This email is Already Existing"
        reject(emailErr)
      }else if(phoneChecking){
        let phoneErr ="This mobile number is Already Existing"
        reject(phoneErr)
        
      }else{
        userData.password = await bcrypt.hash(userData.password, 10);
        userData.address = [] //creating an array for future use
        userData.signupDate = moment().format('MMMM Do YYYY, h:mm:ss a')
        userData.referralId = userData.name + new ObjectId().toString().slice(1, 7)

        userData.status = true
        db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((data) => {
          db.get().collection(collections.WALLET_COLLECTION).insertOne({
            userId: userData._id,
            walletBalance: 0,
            referralId: userData.referralId,
            transaction: []
          })
          resolve(userData)
        })

      }
       
       
  });
  },
  doLogin:(userData)=>{
    return new Promise(async (resolve,reject)=>{ 
      
      let response={}
      let user= await db.get().collection(collections.USER_COLLECTION).findOne({email:userData.email}) 
      if(user&&user.status){
        bcrypt.compare(userData.password,user.password).then((status)=>{

          if(status){
            console.log("ok user")
            response.user=user
            response.status=true

            resolve(response)
          }else{
            console.log("incorect");
            response={
              status:false
            }
            resolve(response)
           
          }
        })
      }else{
        console.log("no user");
        response = {
          status: false
        }
        resolve(response)
      }
    })
  },


  //OTP LOGIN
  otpLogin: (userData) => {
    let response = {};
    return new Promise(async (resolve, reject) => {
      let user = await db.get().collection(collections.USER_COLLECTION).findOne({ phone: userData.phone })
      if (user) {
        response.user = user;
        response.status = true;
        resolve(response);
      } else {
        console.log('Login Failed');
        resolve({ status: false })
      }
    }
    )
  },

  // add to cart
  
  addToCart: (prodId, usrId)=>{
    let proObj={
      item:ObjectId(prodId),
      quantity:1
    }
    console.log(prodId,'*******',usrId);
    return new Promise(async(resolve, reject) => {
      let usrCart=await db.get().collection(collections.CART_COLLECTION).findOne({user:ObjectId(usrId)})
      console.log(usrCart,"fgvd");
      if(usrCart){
        let proexist=usrCart.products.findIndex(products => products.item==prodId)
        // let productExist = usercart.products.findIndex(products => products.item == productid)
        if(proexist!=-1){
          db.get().collection(collections.CART_COLLECTION)
          .updateOne({user:ObjectId(usrId),'products.item':ObjectId(prodId)},
          {
            $inc:{'products.$.quantity':1}
          }
          ).then(()=>{
            resolve()
          })

        }else{
          db.get().collection(collections.CART_COLLECTION).updateOne({ user: ObjectId(usrId) },
            {
              $push: { products: proObj }
            }).then((response) => {
              resolve()
            })


        }
        

      }else{
        
        let cartObj={
          user:ObjectId(usrId),
          products:[proObj]
        }
        db.get().collection(collections.CART_COLLECTION).insertOne(cartObj).then((response)=>{
          resolve(response)
        })
      }
    })

  },

  getCartProducts:(usrId)=>{
    console.log(usrId);
    return new Promise(async(resolve, reject) => {
      let cartItems=await db.get().collection(collections.CART_COLLECTION).aggregate([
        // {
        //   $match:{user:ObjectId(usrId)}
        // },
        // {
        //   $unwind:'$products'
        // },
        // {
        //   $project:{
        //     item:'$products.item',
        //     quantity:'$products.quantity'
        //   } 
        // },
        // {
        //   $lookup:{
        //     from:collections.PRODUCT_COLLECTION,
        //     localField:'item',
        //     foreignField:'_id',
        //     as:'products'
        //   }
        {
          $match: {
            user: ObjectId(usrId)
          }
        }, {
            $unwind: {
              path: '$products'
            }
          }, {
            $project: {
              item: '$products.item',
              quantity: '$products.quantity'
            }
          }, {
            $lookup: {
              from: collections.PRODUCT_COLLECTION,
              localField: 'item',
              foreignField: '_id',
              as: 'products'
            }
          },
          {
            $project:{
              item:1,quantity:1,product:{$arrayElemAt:['$products',0]}
            }
          }
        // }
        // {
        //   $lookup:{
        //     from:collections.PRODUCT_COLLECTION,
        //     let:{proList:"$products"},
        //     pipeline:[
        //       {
        //         $match:{
        //           $expr:{
        //             $in:['$_id','$$proList']
        //           }
        //         }
        //       }
        //     ],
        //     as:'cartItems'
        //   }
        // }
      ]).toArray()
      console.log(cartItems);

     
      resolve(cartItems)
      
    })
  },



  changeProductQuantity:(details)=>{
    
    details.count=parseInt(details.count)
    details.quantity=parseInt(details.quantity)

  return new Promise((resolve, reject) => {
    if(details.count==-1 && details.quantity==1){
      db.get().collection(collections.CART_COLLECTION)
      .updateOne({_id:ObjectId(details.cart)},
       {
        $pull:{products:{item:ObjectId(details.product)}}
       }
      ).then((response)=>{
        resolve({removeProduct:true})
      })
    }else{
      db.get().collection(collections.CART_COLLECTION)
        .updateOne({ _id: ObjectId(details.cart), 'products.item': ObjectId(details.product) },
          {
            $inc: { 'products.$.quantity': details.count }
          }
        ).then((response) => {

          resolve({status:true})
        })

    }

    
  })
  },

  getTotalAmount:(userId)=>{
    return new Promise(async (resolve, reject) => {
      let total = await db.get().collection(collections.CART_COLLECTION).aggregate([
        {
          '$match': {
            'user': ObjectId(userId)
          }
        }, {
          '$unwind': {
            'path': '$products'
          }
        }, {
          '$project': {
            'item': '$products.item',
            'quantity': '$products.quantity'
          }
        }, {
          '$lookup': {
            'from': 'product',
            'localField': 'item',
            'foreignField': '_id',
            'as': 'products'
          }
        }, {
          '$project': {
            'item': 1,
            'quantity': 1,
            'product': {
              '$arrayElemAt': [
                '$products', 0
              ]
            }
          }
        }, {
          '$group': {
            '_id': null,
            'total': {
              '$sum': {
                '$multiply': [
                  '$quantity', '$product.price'
                ]
              }
            }
          }
        }
      ]).toArray()
      console.log(total,'***************************************');
     


      resolve(total[0]?.total)

    })


  },
  // delete product from cart
  deleteProductInCart:(id,userId)=>{
    return new Promise((resolve, reject) => {
      db.get().collection(collections.CART_COLLECTION).updateOne({
        user:ObjectId(userId)
      },
      {
        $pull:{products:{item:ObjectId(id)}}
      }
      ).then((response)=>{
        resolve(response)
      })
    })
  },





// place order
  placeOrder:(order,products,totalPrice,userId,address)=>{
    console.log(order,'//////////////////////??????????????????????////???????????????????');
    // console.log('ppppppppp',order,'9999999', products, totalPrice,'88888888888888888888888');
    return new Promise((resolve, reject) => {
      let status = order['payment-method'] ==='cod'?'placed':'pending'
      let orderObj={
        address:address,
        userId:ObjectId(userId),
        paymentMethod:order['payment-method'],
        products:products,
        totalAmount: totalPrice,
        status:status,
        date:new Date()
                    
      }
      console.log(orderObj,'121212121212121212121112222222222222');
      db.get().collection(collections.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{

        resolve()
      })
      
    })


  },
  getUseraddress:(data,userId)=>{
    console.log(data,'88888888888888888888888');
    return new Promise(async(resolve, reject) => {
    let address= await db.get().collection(collections.USER_COLLECTION).aggregate(
        [
          {
            '$match': {
              '_id': new ObjectId(userId)
            }
          }, {
            '$unwind': {
              'path': '$address'
            }
          }, {
            '$match': {
              'address._id': new ObjectId(data.addressId)
            }
          }, {
            '$project': {
              'address': 1
            }
          }
        ]
      ).toArray()
      address=address[0]
      // address.firstname=address.address.firstname
      // address.lastname=address.address.lastname

      console.log(address, '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
      resolve(address)


    })
  },

  getCartProductList:(userId)=>{
    console.log(userId,';;;;;;;;;;;;');
    return new Promise(async(resolve, reject) => {
      let cart=await db.get().collection(collections.CART_COLLECTION).findOne({user:ObjectId(userId)})
      resolve(cart.products)
      console.log(cart,'11111111');
      console.log(cart.products,'3333333333333333');
      
    })
  },



  //  add address

  addAddress:(data,user)=>{
    console.log(data,"//////////////////////****************/////////");
    data._id = new ObjectId()
    return new Promise((resolve, reject) => {
      db.get().collection(collections.USER_COLLECTION).updateOne(
        {
          _id:ObjectId(user)

        },
        {
          $push:{address:data}
        }
      ).then()
      resolve()

    })
    
  },
  
  getAddress:(user)=>{
    return new Promise(async(resolve, reject) => {
     let address=await db.get().collection(collections.USER_COLLECTION).aggregate([
        {
          $match:{_id:ObjectId(user)}
        },
        {
          $unwind:'$address'
        },
        {
          $project:{
            address:1
          }
        }
      ]).toArray()
      resolve(address)
    })
  },

  // delete Address

  deletAddress:(user,addressId)=>{
    console.log(addressId,"7777777777777777777777777777777777777777777777777777",user);
    return new Promise((resolve, reject) => {
      db.get().collection(collections.USER_COLLECTION).updateOne({
        _id:ObjectId(user)
      },
      {
        $pull:{address:{_id:ObjectId(addressId)}}
      }
      ).then((response)=>{
        resolve()
      })
    })
  },
  //ORDER ADDRESS
  getOrderAddress: (user, addressId) => {
    return new Promise(async (resolve, reject) => {
      let address = await db.get().collection(collections.USER_COLLECTION).aggregate([
        {
          $match: {
            _id:ObjectId(user)
          }
        },
        {
          $unwind: {
            'path': '$address'
          }

        },
        {
          $match: {
            'address._id':ObjectId(addressId)
          }
        },
        {
          $project: {
            'address': 1,
          }
        }
      ]).toArray()
      resolve(address)
    })
  },
  editeProfile: (user, data) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collections.USER_COLLECTION).updateOne(
        {

          _id: ObjectId(user)
        },
        {
          $set: {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            phone: data.mobile

          }
        }
      )
      resolve()
    })

  },


// wallet

    getWallet: (user) => {
      return new Promise((resolve, reject) => {
        db.get().collection(collections.WALLET_COLLECTION).findOne({ userId:ObjectId(user) }).then((response) => {
          resolve(response)
          console.log(response, 'respooooooooooooooonse');
        })
      })
    }

  







};
