const Order = require("../../../models/order")

function orderController(){

    return {
        
        index(req,res){
            Order.find({status:{ $ne :'completed'}},null,{sort:{'createdAt':-1}}).
            populate('customerId','-password').exec((err,orders)=>{
                if(req.xhr){
                    //console.log('ajax request')
                    return res.json(orders)
                }
                else{
                    //console.log('normal request')
                    return res.render('admin/orders')
                }
                
            })
        }
    }
}

module.exports=orderController