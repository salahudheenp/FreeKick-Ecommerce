const salesHelpers=require('../../helpers/sales-report')

exports.getSalesReoport=async (req,res)=>{
    if(req.query?.month){
        let month=req.query?.month.split("-")
        let [yy,mm]=month
        deliverdOrders=await salesHelpers.deliverdOrderList(yy,mm)
        
    }else if(req.query?.daterange){
        deliverdOrders=await salesHelpers.deliverdOrderList(req.query)

    }else{
        deliverdOrders=await salesHelpers.deliverdOrderList()
    }
    // console.log(deliverdOrders,'0000000000000000000999999999999999988888888888888888888888');
    let amount = await salesHelpers.totalAmountOfdelivered()
    console.log(amount,'()()(*)()()()()()');
    res.render('admin/sales-report',{admin:true,deliverdOrders,amount})
}