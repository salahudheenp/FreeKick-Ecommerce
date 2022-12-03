const cartHelpers = require('../../helpers/cart-helpers');
const couponHelpers=require('../../helpers/coupon')


exports.redeemCoupon=async (req,res)=>{
    console.log(req.body);
    let userId = req.session.user._id
    let totalAmount = await cartHelpers.getTotalAmount(userId)
    console.log(totalAmount, '*******');
    await couponHelpers. redeemCoupon(req.body,userId).then(async (couponData) => {
        let couponName=couponData.coupon

        console.log(couponData,'++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++/////////////////****************');
        let minMsg = "This coupen is only valid for purchase above ₹" + couponData.minPrice
        let maxMsg = "This coupen is only valid for purchase below ₹" + couponData.maxPrice

         
        if (totalAmount >= couponData.minPrice && totalAmount <= couponData.maxPrice) {
            let temp = (totalAmount * couponData.couponOffer) / 100
            totalAmount = (totalAmount - temp)
            console.log(totalAmount);
            
                res.json({ total: totalAmount, offer: temp,couponName })
           
       } else if (totalAmount <= couponData.minPrice) {
            res.json({ msg: minMsg, total: totalAmount })
        } else if (totalAmount >= couponData.maxPrice) {
            res.json({ msg: maxMsg, total: totalAmount })
        }
    }).catch(() => {
        let msg = "Invalid Coupon Or It's already Expired"
        res.json({ msg: msg, total: totalAmount })
    })

}