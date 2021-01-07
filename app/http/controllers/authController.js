function authController(){
    

    
    
    return {
        login(req,res){
            res.render('auth/register')
        },
        register(req,res){
            res.render('auth/register')
        }
    }
    
}

module.exports=authController