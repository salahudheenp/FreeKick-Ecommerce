//FORM VALIDATION
// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'

    // Fetch all the forms we want to apply custiom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

// //SIGNUP DATA VALIDATING
function signUpValidate() {
    // const userName=document.getElementById('username')
    const number = document.getElementById('number')
    const email = document.getElementById('email')
    const password = document.getElementById('password')
    const repassword = document.getElementById('repassword')
    const error = document.getElementsByClassName('invalid-feedback')

    if (number.value.trim() === "" || number.value.length < 9) {
        error[0].style.display = "block";
        error[0].innerHTML = "Enter valid phone number";
        number.style.border = "2px solid red";
        return false;
    } else {
        error[0].innerHTML = ""
        number.style.border = "2px solid green";
    }

    if (!(email.value.trim().match(/^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/))) {
        error[1].style.display = "block";
        error[1].innerHTML = "Enter correct email";
        email.style.border = "2px solid red";
        return false;
    } else {
        error[1].innerHTML = ""
        email.style.border = "2px solid green";
    }

    if (password.value.trim() === "" || password.value.length < 8) {
        error[2].style.display = "block";
        error[2].innerHTML = "password must be 8 character";
        password.style.border = "2px solid red";
        return false;
    } else {
        error[2].innerHTML = ""
        password.style.border = "2px solid green";
    }



    if (repassword.value === password.value) {
        error[3].innerHTML = ""
        repassword.style.border = "2px solid green";
    } else {
        error[3].style.display = "block";
        error[3].innerHTML = "Incorrect Password";
        repassword.style.border = "2px solid red";
        return false;
    }
    return true;
}






//IMAGE ZOOM
$(document).ready(function () {
    $(".block__pic").imagezoomsl({
        zoomrange: [2, 2]
    });
});






//CATEGORY CHECKING IF ALREADY EXISTS
$("#addCategory").submit((e) => {
    e.preventDefault();
    $.ajax({
        url: '/admin/category',
        method: 'post',
        data: $("#addCategory").serialize(),
        success: (response) => {
            if (response.status) {
                location.reload()
            } else {
                swal({
                    title: "There is Already a Category....!",
                    text: "Your will not be able to create an existing CATEGORY",
                    type: "warning",
                    confirmButtonColor: "red",
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Ok",
                    closeOnConfirm: true
                })
            }
        }
    })
})

//EDIT CATEGORY
function editCategory(categoryId, categoryName) {
    let category = document.getElementById(categoryId).innerHTML
    swal({
        title: "Edit Category!",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: true,
        animation: "slide-from-top",
        inputValue: category,
        inputPlaceholder: "Edit Category"
    },
        function (inputValue) {
            if (inputValue === null)
                return false;
            if (inputValue === "") {
                return false
            }
            $.ajax({
                url: '/admin/edit-category',
                method: 'put',
                data: {
                    categoryId,
                    inputValue,
                    categoryName
                },
                success: (response) => {
                    if (response.status) {
                        document.getElementById(categoryId).innerHTML = inputValue.toUpperCase()
                    } else {
                        return false
                    }
                }
            })
        });
}


// ad to cart
function addtocart(prodId) {



    $.ajax({
        url: '/user/add-to-cart/' + prodId,
        method: 'get',
        success: (response) => {
            swal({
                title: "Add To Cart",
                type: 'success',
                text: "congratulations!! ",
                icon: "success",
                confirmButtonColor: "#318a2c",
                confirmButtonText: "ok",
                closeOnConfirm: false
            })
            console.log(response)
           



        }

    })




}



//USER ORDER CANCEL
function cancelOrder(orderId, prodId) {
    console.log(prodId, 'djsasfhjdfsijsfj', orderId)
    swal({
        title: "Are you sure?",
        text: "Do you want to cancel the order",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Cancel my order",
        cancelButtonText: "No, cancel please!",
        closeOnConfirm: false,
        closeOnCancel: true
    },
        function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: '/user/cancel-order' ,
                method: 'put',
                    data: {
                        orderId,
                        prodId
                    },
                    success: (response) => {
                        if (response.status) {
                            location.reload()
                            // document.getElementById(orderId + proId).innerHTML = 'canceled'
                            // document.getElementById("status-button").style.display = 'none'
                        }
                    }
                })
            }
        }
    );
}

//return product
function returnProduct(orderId, prodId) {
    console.log(orderId, prodId)
    swal({
        title: "What is the Reason..?",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: true,
        animation: "slide-from-top",
        inputPlaceholder: "Please share with Us..."
    },
        function (inputValue) {
            if (inputValue === null)
                return false;
            if (inputValue === "") {
                return false
            }
            $.ajax({
                url: '/user/return-product',
                method: 'post',
                data: {
                    orderId,
                    prodId,
                },
                success: (response) => {
                    if (response.status) {
                        console.log('dsfajusjujuj')
                        location.href = '/user/orders'
                    } else {
                        return false
                    }
                }
            })
        });
}

// /return product
function returnProductAdmin(orderId, prodId) {
    console.log(orderId,"()()()()()()", prodId,'*********************')
    // swal({
    //     title: "What is the Reason..?",
    //     type: "input",
    //     showCancelButton: true,
    //     closeOnConfirm: true,
    //     animation: "slide-from-top",
    //     inputPlaceholder: "Please share with Us..."
    // },
    //     function (inputValue) {
    //         if (inputValue === null)
    //             return false;
    //         if (inputValue === "") {
    //             return false
    //         }
            $.ajax({
                url: '/admin/return-product',
                method: 'post',
                data: {
                    orderId,
                    prodId,
                },
                success: (response) => {
                    if (response.status) {
                        console.log('dsfajusjujuj')
                        location.href = '/admin/order'
                    } else {
                        console.log("&&&&&&&&&&&&");
                        return false
                    }
                }
            })
        
}




//SALES REPORT
function salesReport(days, buttonId) {
    $.ajax({
        url: '/admin/sales-report/' + days,
        method: 'get',
        success: (response) => {
            if (response) {
                const buttons = document.querySelectorAll('button');
                buttons.forEach(button => {
                    button.classList.remove('active');
                });
                document.getElementById(buttonId).classList.add("active");
                document.getElementById('days').innerHTML = buttonId
                document.getElementById('deliveredOrders').innerHTML = response.deliveredOrders
                document.getElementById('shippedOrders').innerHTML = response.shippedOrders
                document.getElementById('placedOrders').innerHTML = response.placedOrders
                document.getElementById('canceledOrders').innerHTML = response.canceledOrders
                document.getElementById('cashOnDelivery').innerHTML = response.cashOnDelivery
                document.getElementById('onlinePayment').innerHTML = response.onlinePayment
                document.getElementById('users').innerHTML = response.users
            }
        }
    })
}



//PDF AND EXCEL
$(document).ready(function ($) {
    $(document).on('click', '.btn_print', function (event) {
        event.preventDefault();
        var element = document.getElementById('container_content');

        let randomNumber = Math.floor(Math.random() * (10000000000 - 1)) + 1;

        var opt =
        {
            margin: 0,
            filename: 'pageContent_' + randomNumber + '.pdf',
            html2canvas: { scale: 10 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    });
});

function export_data() {
    let data = document.getElementById('container_content');
    var fp = XLSX.utils.table_to_book(data, { sheet: 'vishal' });
    XLSX.write(fp, {
        bookType: 'xlsx',
        type: 'base64'
    });
    XLSX.writeFile(fp, 'test.xlsx');
}


//DASHBOARD CHART
window.addEventListener('load', () => {
    histogram(1, 'daily')
})

function histogram(days, buttonId) {

    $.ajax({
        url: '/admin/dashboard/' + days,
        method: 'get',
        success: (response) => {
            if (response) {
                const buttons = document.querySelectorAll('button');
                buttons.forEach(button => {
                    button.classList.remove('active');
                });
                document.getElementById(buttonId).classList.add("active");

                let totalOrder = response.deliveredOrders + response.shippedOrders + response.placedOrders

                document.getElementById('totalOrders').innerHTML = totalOrder
                document.getElementById('placedOrders').innerHTML = response.placedOrders
                document.getElementById('deliveredOrders').innerHTML = response.deliveredOrders
                document.getElementById('totalAmount').innerHTML = response.totalAmount

                var xValues = ["Delivered", "Shipped", "Placed", "Pending", "Canceled","returned"];
                var yValues = [response.deliveredOrders, response.shippedOrders, response.placedOrders, response.pendingOrders, response.canceledOrders, response.returnedOrders];
                var barColors = ["green", "blue", "orange", "brown", "red","pink"];

                new Chart("order", {
                    type: "bar",
                    data: {
                        labels: xValues,
                        datasets: [{
                            backgroundColor: barColors,
                            data: yValues
                        }]
                    },
                    options: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: "Order Report"
                        }
                    }
                });


                var xValues = ["COD", "ONLINE"];
                var yValues = [response.codTotal, response.onlineTotal];

                var barColors = [
                    "#b91d47",
                    "#00aba9",
                ];

                new Chart("payment", {
                    type: "pie",
                    data: {
                        labels: xValues,
                        datasets: [{
                            backgroundColor: barColors,
                            data: yValues
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: "Payment Report"
                        }
                    }
                });



                // var xValues = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
                // var yValues = [0, response.users];

                // new Chart("user", {
                //     type: "line",
                //     data: {
                //         // labels: xValues,
                //         datasets: [{
                //             fill: true,
                //             lineTension: 0,
                //             // backgroundColor: "rgba(0,0,255,1.0)",
                //             borderColor: "rgba(0,0,255,0.1)",
                //             data: yValues
                //         }]
                //     },
                //     options: {
                //         legend: { display: false },
                //         scales: {
                //             yAxes: [{ ticks: { min: 0, max: 10 } }],
                //         },
                //         title: {
                //             display: true,
                //             text: "Users Signed"
                //         }
                //     }
                // });
            }
        }
    })
}


//ADD TO WISHLIST
function addToWishlist(prodId) {
    console.log(prodId,"??????????????????????")
    $.ajax({
        url: '/user/add-to-wishlist/' + prodId,
        method: 'get',
        success: (response) => {
            if (response.status) {

                document.getElementById('add' + prodId).classList.add('d-none')
                document.getElementById('remove' + prodId).classList.remove('d-none')
            } else {
                document.getElementById('remove' + prodId).classList.add('d-none')
                document.getElementById('add' + prodId).classList.remove('d-none')
            }
        }
    })
}
