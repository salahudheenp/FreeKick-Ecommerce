const passwordHelpers=require("../../helpers/password")
const otp = require('../../otp-token');
const client = require('twilio')(otp.accountSID, otp.authToken)

module.exports={
    getForgotPassword:(req,res)=>{
        res.render('user/forgot-otp-login', { not: true })
    },

    postMobileNumber:(req,res)=>{
        console.log(req.body,'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        passwordHelpers.otpLogin(req.body).then((response) => {
          console.log(response,'()()()()()()()(');
            let phone = response.user.phone
            client
                .verify
                .services(otp.serviceID)
                .verifications
                .create({
                    to: `+91${phone}`,
                    channel: 'sms'
                }).then((data) => {
                    req.session.user = response.user;
                    res.render('user/forgot-otp-verify', { phone, not: true ,login:true})
                }).catch((err) => {
                    console.log(err);
                })
        }).catch((response) => {
            req.session.loginErr = "Please check your mobile number";
            res.redirect('/user/login')
        })
    },
    getVerify:(req,res)=>{
        res.render('user/forgot-otp-verify',{login:true})
    },




    

    postOtp:(req,res)=>{
        console.log(req.body.phone,'ooooooooooooooooooooooooooooooooooo');
        client
            .verify
            .services(otp.serviceID)
            .verificationChecks
            .create({
                to: `+91${req.body.phone}`,
                code: req.body.otp
            }).then((data) => {
                console.log(data);
                if (data.valid) {
                    req.session.loggedIn = true;

                    res.render('user/password',{login:true})
                } else {
                    delete req.session.user
                    req.session.otpErr = "Enter valid OTP"
                    res.redirect('/user/login')
                }
            }).catch((err) => {
                delete req.session.user
                res.redirect('/user/login')
            })
    },

    postNewPassword:(req,res)=>{
        let userId=req.session.user._id
        console.log(req.body,'*****//////////////*********/////////******/////////////////');
        passwordHelpers.postNewPassword(req.body,userId).then((response)=>{
            res.redirect('/user')
        }).catch((err)=>{
            res.render('user/password', { login: true,err })
        })
    },

    resendOtp:(req,res)=>{
        let phone=req.params.phone
        console.log(phone,'>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<))))))))))))))))))))))<<<<<<<<');
        passwordHelpers.resendOtp(phone).then((response) => {
            console.log(response, '()()()()()()()(');
            let phone = response.user.phone
            client
                .verify
                .services(otp.serviceID)
                .verifications
                .create({
                    to: `+91${phone}`,
                    channel: 'sms'
                }).then((data) => {
                    req.session.user = response.user;
                    res.render('user/password', { phone, not: true, login: true })
                }).catch((err) => {
                    console.log(err);
                })
        }).catch((response) => {
            req.session.loginErr = "Please check your mobile number";
            res.redirect('/user/login')
        })
    }
    
}