
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