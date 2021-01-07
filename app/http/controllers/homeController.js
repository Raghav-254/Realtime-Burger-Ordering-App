const Menu=require('../../models/menu')
function homeController(){
    return{
        index:async (req,res)=>{
            const pizzas=await Menu.find()
            //console.log(pizzas)
            return res.render('home',{pizzas:pizzas})
        }
    }

    
    /*New way
    return {
        index(req,res){
            res.render('home')
        }
    }
    */
}

module.exports=homeController