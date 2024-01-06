


//to block or unblock user in admin panel

function block_unblock(id){
    console.log("ajax working ");
    $.ajax({
        
        url:"/blockuser/"+`${id}`,
        
        method:"get",
        success:function (response){
            window.location.reload()
            alert(response.msg)
           
            
        },
        error:function (err){
            alert("Something Error")
            console.log(err);
        }
    })
}

//to delete a category

function delete_category(id){
    let cnfrm = confirm("Are you sure want to remove this category?")
    if(cnfrm == true){
        $.ajax({
            url:"/deletecategory/"+id,

            method:"get",
            success: function (response){
                location.reload()
                alert(response.msg)
            },
            error:function (err){
                alert("Something Error")
        
            }
        })
    }
}

//to delete a brand

function delete_Brand(id){
    let cnfrm = confirm("Are you sure want to remove this Brand?")
    if(cnfrm == true){
        $.ajax({
            url:"/deletebrand/"+id,

            method:"get",
            success: function (response){
                location.reload()
                alert(response.msg)
            },
            error:function (err){
                alert("Something Error")
        
            }
        })
    }   
}

//to show or hide a product

function show_hide(id){
    $.ajax({
        
        url:"/showorhide/"+`${id}`,
        
        method:"get",
        success:function (response){
            window.location.reload()
            alert(response.msg)
           
            
        },
        error:function (err){
            alert("Something Error")
            console.log(err);
        }
    })
}

//delete product 

function deleteProduct(id){
    let cnfrm = confirm("Are you sure want to delete this Product ?")
    if(cnfrm == true){
        $.ajax({
            url:"/deleteproduct/"+id,

            method:"get",
            success: function (response){
                location.reload()
                alert(response.msg)
            },
            error:function (err){
                alert("Something Error")
        
            }
        })
    }    
}


//to delete address in user profile
function deleteAddress(id){
    let cnfrm = confirm("Are you sure want to remove this Address?")
    if(cnfrm == true){
        console.log("ajjaxxxxx");
        $.ajax({
            url:"/deleteaddress/"+id,

            method:"get",
            success: function (response){
                location.reload()
                alert(response.msg)
            },
            error:function (err){
                alert("Something Error")
        
            }
        })
    }
}

//add to cart 
function addToCart(id){
    console.log("ajax working ");
    $.ajax({
        
        url:"/addtocart/"+`${id}`,
        
        method:"get",
        success:function (response){
            window.location.reload()
            alert(response.msg)

        },
        error:function (err){
            alert("Something Error")
            console.log(err);
        }
    })
}


//update quantity count in cart
function updateQuantity(count,prodId,qty,usrId){
    console.log("ajax okkk");
    $.ajax({
        
        url:"/updatequantity/"+`${count}/${prodId}/${qty}/${usrId}`,
        
        method:"get",
        success:function (response){
            window.location.reload()
            alert(response.msg)
           
            
        },
        error:function (err){
            alert("Something Error")
            console.log(err);
        }
    })
}


//remove product from cart
function removeCart(prdktId){
    console.log("rmv crt");
    $.ajax({
        
        url:"/removecart/"+`${prdktId}`,
        
        method:"get",
        success:function (response){
            window.location.reload()
            alert(response.msg)
           
            
        },
        error:function (err){
            alert("Something Error")
            console.log(err);
        }
    })
}


//clear all cart products
function clearCart(prdktid){
    console.log("clr crt");
    let cnfrm = confirm("Are you sure want to clear cart?")
    if(cnfrm==true){
        $.ajax({
            url:"/clearcart/"+`${prdktid}`,
            
            method:"get",
            success:function (response){
                window.location.reload()
                alert(response.msg)
               
                
            },
            error:function (err){
                alert("Something Error")
                console.log(err);
            }
        })
    }
}


//select an address to order a product
function selectAddress(adrsid){
    console.log("select address");
    console.log(adrsid);
    $.ajax({
        
        url:"/selectaddress/"+`${adrsid}`,
        
        method:"get",
        success:function (response){
            window.location.reload()
            alert(response.msg)
        },
        error:function (err){
            alert("Something Error")
            console.log(err);
        }
    })
}


//select an address to order a product
function confirmOrder(type){
    console.log("order type",type);

    $.ajax({
        
        url:"/confirmorder/"+`${type}`,
        
        method:"get",
        success:function (response){
            // window.location.reload()
            alert(response.msg)
        },
        error:function (err){
            alert("Something Error")
            console.log(err);
        }
    })
}


//update order status in admin side 
function updateOrderStatus(orderid,status){
    console.log("update");
    let cnfrm = confirm(`Are you sure want to upadte order status to ${status}?`)
    if(cnfrm==true){
        $.ajax({
            url:"/updateorderstatus/"+`${orderid}/${status}`,
            
            method:"get",
            success:function (response){
                window.location.reload()
                alert(response.msg)
               
                
            },
            error:function (err){
                alert("Something Error")
                console.log(err);
            }
        })
    }
}


//cancel an order from the user side
function cancelOrder(orderid){
    console.log("update");
    let cnfrm = confirm(`Are you sure want to cancel this order?`)
    if(cnfrm==true){
        $.ajax({
            url:"/cancelorder/"+`${orderid}`,
            
            method:"get",
            success:function (response){
                window.location.reload()
                alert(response.msg)
               
                
            },
            error:function (err){
                alert("Something Error")
                console.log(err);
            }
        })
    }
}



