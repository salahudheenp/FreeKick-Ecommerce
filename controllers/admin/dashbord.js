const dashbordHelpers=require('../../helpers/dashbord')



exports.getDashbord=(req,res)=>{
    res.render("admin/home", { admin: true })
}
    


exports.getDashbordDays=(req,res)=>{
    dashbordHelpers.dashboardCount(req.params.days).then((data)=>{
    res.json(data)
  })
}

// exports.
// dashboardrender = async function (req, res, next) {
//     let count = {}
//     count.totalRevenue = await dashbordHelpers.dashboardTotalAmount()
//     count.totalOrder = await dashbordHelpers.dashboardTotalOrder()
//     count.totalUser = await dashbordHelpers.dashboardTotalUsers()
//     console.log(count,'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

//     res.render("admin/dashbord", { admin: true,count});
// };

// exports.chart = async (req, res) => {

//     let barChart = await dashbordHelpers.dashboardChartData()
//     // console.log(barChart);

//     let pieChart = await dashbordHelpers.dashboardPieChart()
//     // console.log(pieChart);

//     let response = {}
//     response.barChart = barChart
//     response.pieChart = pieChart
//     console.log(response);
//     res.json(response)

// }

// exports.adminReport = (req, res) => {
//     console.log(req.params.days)
//     dashbordHelpers.dashboardCount(req.params.days).then((data) => {
//         console.log(data);
//         res.json(data);
//     });
// };