
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