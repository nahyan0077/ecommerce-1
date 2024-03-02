
//to block or unblock user in admin panel

function block_unblock(id) {
    // Show SweetAlert confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, block it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // User clicked 'Yes', proceed with the blocking
            console.log("ajax working ");
            $.ajax({
                url: "/blockuser/" + `${id}`,
                method: "patch",
                success: function (response) {
                    Swal.fire({
                        text: response.msg,
                        icon: 'success',
                        timer: 3000,
                        showConfirmButton: false
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                },
                error: function (err) {
                    Swal.fire({
                        text: 'Something went wrong',
                        icon: 'error',
                        timer: 3000,
                        showConfirmButton: false
                    });
                    console.log(err);
                }
            });
        }
    });
}





//to delete a category

function delete_category(id) {
    // Show SweetAlert confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // User clicked 'Yes', proceed with the deletion
            $.ajax({
                url: "/deletecategory/" + id,
                method: "delete",
                success: function (response) {
                    Swal.fire({
                        text: response.msg,
                        icon: 'success',
                        timer: 3000,
                        showConfirmButton: false
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                },
                error: function (err) {
                    Swal.fire({
                        text: 'Something went wrong',
                        icon: 'error',
                        timer: 3000,
                        showConfirmButton: false
                    });
                }
            });
        }
    });
}




//to delete a brand

function delete_Brand(id) {
    // Show SweetAlert confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // User clicked 'Yes', proceed with the deletion
            $.ajax({
                url: "/deletebrand/" + id,
                method: "delete",
                success: function (response) {
                    Swal.fire({
                        text: response.msg,
                        icon: 'success',
                        timer: 3000,
                        showConfirmButton: false
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                },
                error: function (err) {
                    Swal.fire({
                        text: 'Something went wrong',
                        icon: 'error',
                        timer: 3000,
                        showConfirmButton: false
                    });
                }
            });
        }
    });
}




//to show or hide a product
function show_hide(id) {
    // Show SweetAlert confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: 'You want to change the visibility status!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // User clicked 'Yes', proceed with changing visibility
            $.ajax({
                url: "/showorhide/" + `${id}`,
                method: "patch",
                success: function (response) {
                    Swal.fire({
                        text: response.msg,
                        icon: 'success',
                        timer: 3000,
                        showConfirmButton: false
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                },
                error: function (err) {
                    Swal.fire({
                        text: 'Something went wrong',
                        icon: 'error',
                        timer: 3000,
                        showConfirmButton: false
                    });
                    console.log(err);
                }
            });
        }
    });
}






//delete product 
function deleteProduct(id) {
    // Show SweetAlert confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete this product!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // User clicked 'Yes', proceed with product deletion
            $.ajax({
                url: "/deleteproduct/" + id,
                method: "delete",
                success: function (response) {
                    Swal.fire({
                        text: response.msg,
                        icon: 'success',
                        timer: 3000,
                        showConfirmButton: false
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                },
                error: function (err) {
                    Swal.fire({
                        text: 'Something went wrong',
                        icon: 'error',
                        timer: 3000,
                        showConfirmButton: false
                    });
                    console.log(err);
                }
            });
        }
    });
}





//to delete address in user profile
function deleteAddress(id) {
    // Show SweetAlert confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: 'You want to remove this address!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // User clicked 'Yes', proceed with address removal
            console.log("ajjaxxxxx");
            $.ajax({
                url: "/deleteaddress/" + id,
                method: "delete",
                success: function (response) {
                    Swal.fire({
                        text: response.msg,
                        icon: 'success',
                        timer: 3000,
                        showConfirmButton: false
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                },
                error: function (err) {
                    Swal.fire({
                        text: 'Something went wrong',
                        icon: 'error',
                        timer: 3000,
                        showConfirmButton: false
                    });
                    console.log(err);
                }
            });
        }
    });
}





//add to cart 
function addToCart(id,discPrice) {
    console.log("ajax working ");
    $.ajax({
        url: "/addtocart/" + `${id}/${discPrice}`,
        method: "put",
        success: function (response) {
            Toastify({
                text: response.msg,
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "green",
                stopOnFocus: true,
            }).showToast();

            // Reload the page after 3 seconds
            setTimeout(function () {
                window.location.reload();
            }, 500);
        },
        error: function (err) {
            Toastify({
                text: "Something Error",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "red",
                stopOnFocus: true,
            }).showToast();
            console.log(err);
        }
    });
}



//update quantity count in cart
function updateQuantity(count, prodId, qty, usrId) {
    console.log("ajax okkk", prodId);
    $.ajax({
        url: "/updatequantity/" + `${count}/${prodId}/${qty}/${usrId}`,
        method: "patch",
        success: function (res) {
            if (res.success == true) {
                const quantityInput = $(`#quantity-${prodId}`);
                const currentQuantity = parseInt(quantityInput.val());
                console.log("dfgd", res.prdktQty);

                if (res.count == 1) {
                    const newQuantity = currentQuantity + 1;
                    quantityInput.val(newQuantity);

                    // Check if the stock limit has been reached
                    if (res.prdktQty <= newQuantity) {
                        Toastify({
                            text: "Product stock limit has reached",
                            duration: 3000,
                            gravity: "top",
                            position: "center",
                            backgroundColor: "red",
                            stopOnFocus: true,
                        }).showToast();
                        const plusButton = quantityInput.next('button');
                        plusButton.prop('disabled', true);
                        location.reload()
                    }

                    // Update the +/- button disable attribute
                    const minusButton = quantityInput.prev('button');
                    minusButton.prop('disabled', newQuantity === 1);
                } else {
                    // Decrement the quantity
                    const newQuantity = Math.max(currentQuantity - 1, 1);
                    quantityInput.val(newQuantity);

                    // Update the +/- button disable attribute
                    const minusButton = quantityInput.prev('button');
                    const plusButton = quantityInput.next('button');
                    minusButton.prop('disabled', newQuantity === 1);
                    plusButton.prop('disabled', newQuantity === 5);
                }

                // Update the total and grand total on the client side
                $('#total-price').text(`₹ ${res.total}`);
                $('#grand-total').text(`₹ ${res.grandTotal}`);
                $('#totalDiscount').text(`₹ ${res.totalDiscount}`);
            } else if (res.success == false) {
                Toastify({
                    text: res.msg,
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "red",
                    stopOnFocus: true,
                }).showToast();

                // Reload the page after 3 seconds
                setTimeout(function () {
                    window.location.reload();
                }, 500);
            }
        },
        error: function (err) {
            alert("Something Error");
            console.log(err);
        }
    });
}








//remove product from cart
function removeCart(prdktId) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'This will remove the item from your cart.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove from cart!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "/removecart/" + `${prdktId}`,
                method: "delete",
                success: function (response) {
                    Toastify({
                        text: response.msg,
                        duration: 3000,
                        gravity: 'top',
                        position: 'center',
                        backgroundColor: 'green',
                        stopOnFocus: true,
                    }).showToast();

                    // Reload the page after 3 seconds
                    setTimeout(function () {
                        window.location.reload();
                    }, 500);
                },
                error: function (err) {
                    Toastify({
                        text: "Something went wrong. Please try again.",
                        duration: 3000,
                        gravity: 'top',
                        position: 'center',
                        backgroundColor: 'red',
                        stopOnFocus: true,
                    }).showToast();
                }
            });
        }
    });
}


function clearCart(prdktid) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'This will remove all items from your cart.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, clear the cart!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "/clearcart/" + `${prdktid}`,
                method: "delete",
                success: function (response) {
                    Toastify({
                        text: response.msg,
                        duration: 3000,
                        gravity: 'top',
                        position: 'center',
                        backgroundColor: 'green',
                        stopOnFocus: true,
                    }).showToast();

                    // Reload the page after 3 seconds
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                },
                error: function (err) {
                    Toastify({
                        text: "Something went wrong. Please try again.",
                        duration: 3000,
                        gravity: 'top',
                        position: 'center',
                        backgroundColor: 'red',
                        stopOnFocus: true,
                    }).showToast();
                }
            });
        }
    });
}


//select an address to order a product
function selectAddress(adrsid) {
    console.log("select address");
    console.log(adrsid);
    $.ajax({
        url: "/selectaddress/" + `${adrsid}`,
        method: "get",
        success: function (response) {
            Toastify({
                text: response.msg,
                duration: 3000,
                gravity: 'top',
                position: 'center',
                backgroundColor: 'green',
                stopOnFocus: true,
            }).showToast();

            // Reload the page after 3 seconds
            setTimeout(function () {
                window.location.reload();
            }, 1000);
        },
        error: function (err) {
            Toastify({
                text: "Something went wrong. Please try again.",
                duration: 3000,
                gravity: 'top',
                position: 'center',
                backgroundColor: 'red',
                stopOnFocus: true,
            }).showToast();
        }
    });
}





//-------------------razorPay and payments---------------------




//select an address to order a product
function confirmOrder(type) {
    console.log("order type", type);

    $.ajax({
        url: "/confirmorder/" + `${type}`,
        method: "get",
        success: function (res) {
            Toastify({
                text: res.msg,
                duration: 3000,
                gravity: 'top',
                position: 'center',
                backgroundColor: 'red',
                stopOnFocus: true,
            }).showToast();

            if (res.payMthd == "COD") {
                console.log("cod");

                location.href = "/paymentsuccesspage";
            } else if (res.payMthd == "online") {

                console.log("onlin", res.order);
                createRazorpay(res.order);
            } else if (res.payMthd == "wallet") {
                console.log("waltt");

                location.href = "/paymentsuccesspage";
            }
        },
        error: function (err) {
            Toastify({
                text: "Something went wrong. Please try again.",
                duration: 3000,
                gravity: 'top',
                position: 'center',
                backgroundColor: 'red',
                stopOnFocus: true,
            }).showToast();
            console.log(err);
        }
    });
}




//   create razorpaay-------------------
function createRazorpay(order) {

    const id = order.id;
    const total = order.amount;
    console.log("kujghio", id, total);
    var options = {
        key: 'rzp_test_EIu4LwyKLdhV1J',
        amount: total,
        currency: 'INR',
        name: 'DropShip',
        description: 'Test Transaction',
        image: '../images/ds_blk.png',
        order_id: id,
        handler: function (response) {

            // alert(response.razorpay_payment_id);
            // alert(response.razorpay_order_id);
            verifyPayment(response, order)

        },
        theme: {
            color: '#3c3c3c'
        }
    }
    var rzp1 = new Razorpay(options);
    rzp1.open();
}


// verify payment -----------------------------
function verifyPayment(payment, order) {
    $.ajax({

        url: '/verifypayment',
        method: "post",
        data: {
            payment,
            order
        },
        success: function (response) {
            if (response.success) {
                location.href = '/paymentsuccesspage'
            }
        },
        error: function (err) {
            alert("Something Error")

        }
    })
}





//-------------------order status update admin side-----------------------



//update order status in admin side 
function updateOrderStatus(orderid, status) {
    // Show SweetAlert confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: `Are you sure you want to update order status to ${status}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // User clicked 'Yes', proceed with the status update
            $.ajax({
                url: `/updateorderstatus/${orderid}/${status}`,
                method: 'put',
                success: function (response) {
                    Swal.fire({
                        text: response.msg,
                        icon: 'success',
                        timer: 3000,
                        showConfirmButton: false
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);

                },
                error: function (err) {
                    Swal.fire({
                        text: 'Something went wrong',
                        icon: 'error',
                        timer: 3000,
                        showConfirmButton: false
                    });
                    console.log(err);
                }
            });
        }
    });
}






//------------------------cancel orders single or all-------------------






//cancel an order from the user side
function cancelOrder(orderid) {
    // Show SweetAlert for confirmation
    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to cancel this order?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // If confirmed, proceed with the cancellation
            $.ajax({
                url: "/cancelorder/" + `${orderid}`,
                method: "patch",
                success: function (response) {
                    window.location.reload();
                    // Show success notification using Toastify
                    Toastify({
                        text: response.msg,
                        duration: 3000,
                        gravity: "top",
                        position: "center",
                        backgroundColor: "green",
                        stopOnFocus: true,
                    }).showToast();
                },
                error: function (err) {
                    // Show error notification using Toastify
                    Toastify({
                        text: 'Something went wrong!',
                        duration: 3000,
                        gravity: "top",
                        position: "center",
                        backgroundColor: "red",
                        stopOnFocus: true,
                    }).showToast();
                    console.log(err);
                },
            });
        }
    });
}




//cancel a single product in an order
function cancelSingleProduct(prodktid, orderid, index) {
    // Show SweetAlert for confirmation
    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to cancel this product?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // If confirmed, proceed with the cancellation
            $.ajax({
                url: "/cancelsingleproduct/" + `${prodktid}/${orderid}/${index}`,
                method: "patch",
                success: function (response) {
                    window.location.reload();
                    // Show success notification using Toastify
                    Toastify({
                        text: response.msg,
                        duration: 3000,
                        gravity: "top",
                        position: "center",
                        backgroundColor: "green",
                        stopOnFocus: true,
                    }).showToast();
                },
                error: function (err) {
                    // Show error notification using Toastify
                    Toastify({
                        text: 'Something went wrong!',
                        duration: 3000,
                        gravity: "top",
                        position: "center",
                        backgroundColor: "red",
                        stopOnFocus: true,
                    }).showToast();
                    console.log(err);
                },
            });
        }
    });
}






//-------------------return-----------------------------------------




//return request response from admin 
function submitReturnResponse(prdktId, orderId, userId, status, index) {
    console.log("return response type", prdktId, orderId, userId, status, index);

    $.ajax({
        url: "/submitreturnresponse",
        method: "post",
        data: {
            prdktId: prdktId,
            orderId: orderId,
            userId: userId,
            status: status,
            index: index
        },
        success: function (response) {
            window.location.reload();
            alert(response.msg);
        },
        error: function (err) {
            alert("Something Error");
            console.log(err);
        }
    });
}







//---------------------------coupon----------------------------




//delete a coupon in admin side
function deleteCoupon(cupnId) {
    // Show SweetAlert confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // User clicked 'Yes', proceed with the deletion
            $.ajax({
                url: "/deletecoupon/" + `${cupnId}`,
                method: "delete",
                success: function (response) {
                    Swal.fire({
                        text: response.msg,
                        icon: 'success',
                        timer: 3000,
                        showConfirmButton: false
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                },
                error: function (err) {
                    Swal.fire({
                        text: 'Something went wrong',
                        icon: 'error',
                        timer: 3000,
                        showConfirmButton: false
                    });
                    console.log(err);
                }
            });
        }
    });
}






//apply coupon by checking the coupon
function applyCoupon() {
    // Assuming you want to get the coupon code from the input field
    var couponCode = document.getElementById("couponCode").value;

    $.ajax({
        url: "/applycoupon",
        method: "post",
        data: { couponCode: couponCode }, // Pass the coupon code to the server
        success: function (response) {
            // Show success notification using SweetAlert
            if (response.msg) {
                Swal.fire({
                    icon: 'success',
                    title: 'Coupon Applied',
                    text: response.msg,
                    showConfirmButton: false,
                    timer: 3000
                });
            } else if (response.errMsg) {
                Swal.fire({
                    icon: 'error',
                    title: 'Coupon not Applied',
                    text: response.errMsg,
                    showConfirmButton: false,
                    timer: 3000
                });
            }
            // Delay the reload by 2 seconds (2000 milliseconds)
            setTimeout(function () {
                window.location.reload();
            }, 2000);
        },
        error: function (err) {
            // Show error notification using Toastify
            Toastify({
                text: 'Something went wrong!',
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "red",
                stopOnFocus: true,
            }).showToast();
            console.log(err);
        }
    });
}









//add to wishlist 

function addToWishlist(prddktId) {
    $.ajax({
        url: "/addtowishlist/" + `${prddktId}`,
        method: "get",
        success: function (res) {
            if (res.userr == false) {
                Toastify({
                    text: 'No user Found Please Login',
                    duration: 3000,
                    gravity: 'top',
                    position: 'center',
                    backgroundColor: 'red',
                    stopOnFocus: true,
                }).showToast();
            } else if (res.prdktExist == false && res.userr == true) {
                // Show success notification using Toastify
                Toastify({
                    text: 'Product added to wishlist',
                    duration: 3000,
                    gravity: 'top',
                    position: 'center',
                    backgroundColor: 'blue',
                    stopOnFocus: true,
                }).showToast();
            } else if (res.prdktExist == true && res.userr == true) {
                // Show alert for existing product in the wishlist
                Swal.fire({
                    icon: 'info',
                    title: 'Product Already Exist',
                    text: 'This product already exists in the wishlist',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        },
        error: function (err) {
            // Show error notification using SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Something Went Wrong',
                text: 'An error occurred while adding to wishlist',
                showConfirmButton: false,
                timer: 3000
            });
            console.log(err);
        }
    });
}


//remove product form wishlist
function removeFromWishlist(prdktid, wishId) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "/removefromwishlist/" + `${prdktid}/${wishId}`,
                method: "delete",
                success: function (response) {
                    Toastify({
                        text: response.msg,
                        duration: 3000,
                        gravity: 'top',
                        position: 'center',
                        backgroundColor: 'green',
                        stopOnFocus: true,
                    }).showToast();

                    // Reload the page after 3 seconds
                    setTimeout(function () {
                        location.reload();
                    }, 500);
                },
                error: function (err) {
                    Toastify({
                        text: "Something went wrong. Please try again.",
                        duration: 3000,
                        gravity: 'top',
                        position: 'center',
                        backgroundColor: 'red',
                        stopOnFocus: true,
                    }).showToast();
                }
            });
        }
    });
}



//delete an offer in admin side
function delete_offer(offerid) {
    // Show SweetAlert confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // User clicked 'Yes', proceed with the deletion
            $.ajax({
                url: "/deleteoffer/" + `${offerid}`,
                method: "delete",
                success: function (response) {
                    Swal.fire({
                        text: response.msg,
                        icon: 'success',
                        timer: 3000,
                        showConfirmButton: false
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                },
                error: function (err) {
                    Swal.fire({
                        text: 'Something went wrong',
                        icon: 'error',
                        timer: 3000,
                        showConfirmButton: false
                    });
                    console.log(err);
                }
            });
        }
    });
}



function updatecount(id) {
    $.ajax({
        url: id,
        method: 'get',
        success: (res) => {
            new Chart("reportsChart", {
                type: "line",
                data: {
                    labels: res.labelsByCount,
                    datasets: [{
                        label: "Sales by orders",
                        data: res?.dataByCount,
                        borderColor: "blue",
                        fill: false
                    }]
                },
                options: {
                    legend: { display: true },
                    text: "Sales by Amount"
                }
            });

            var barColors = ["red", "green", "blue", "orange", "brown", "blue",
                "#00aba9",
                "#2b5797",
                "#e8c3b9",
                "#1e7145",
                "red", "green"];

            new Chart("barChart", {
                type: "bar",
                data: {
                    labels: res.labelsByAmount,
                    datasets: [{
                        backgroundColor: barColors,
                        data: res?.dataByAmount
                    }]
                },
                options: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: "Sales by Amount"
                    }
                }
            });

            var barColors = [
                "blue",
                "#00aba9",
                "#2b5797",
                "#e8c3b9",
                "#1e7145",
                "red", "green", "blue", "orange", "brown", "yellow"
            ];

            new Chart("pieChart", {
                type: "pie",
                data: {
                    labels: res.labelsByCount,
                    datasets: [{
                        backgroundColor: barColors,
                        data: res.dataByCount
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "sales by order"
                    }
                }
            });
        }
    });
}







