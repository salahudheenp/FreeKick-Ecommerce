const couponHelpers=require('../../helpers/coupon')

const moment = require('moment')


exports.getCoupon=async (req,res)=>{
    let coupon = await couponHelpers.getCoupon()
    res.render('admin/coupon', { admin: true, coupon })
}

exports.addCoupon=(req,res)=>{
    couponHelpers.addCoupon(req.body).then(() => {
        res.json({ status: true })
    }).catch(() => {
        console.log('Failed');
        res.json({ status: false })
    })
}

exports.deleteCoupon=(req,res)=>{
    couponHelpers.deleteCoupon(req.body.coupon).then((response) => {
        res.json({ response })
    })
}