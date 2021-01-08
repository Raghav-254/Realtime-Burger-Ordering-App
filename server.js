const express=require('express')
const app=express()
const ejs=require('ejs')
const path=require('path')
const expressLayout=require('express-ejs-layouts')
const  mongoose  = require('mongoose')
const session=require('express-session')
const flash=require('express-flash')
const passport=require('passport')
const MongoDbStore=require('connect-mongo')(session)
require('dotenv').config()
const PORT= 3000


//Database connection

const url='mongodb://localhost:27017/pizza';

mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const connection=mongoose.connection;
connection.once('open',()=>{
    console.log('Database connected..')
}).catch(err=>{
    console.log('Connection failed..')
})

//Session Store
let mongoStore=new MongoDbStore({
    mongooseConnection:connection,
    collection:'sessions'   
})


//Session Config
app.use(session({
    secret:process.env.SECRET_KEY,
    resave: false,
    store:mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000*60*60*24 } //24 hours
}))

// Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//Global middleware
app.use((req,res,next)=>{
    res.locals.session=req.session
    res.locals.user=req.user
    next()
})
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')



//set Template Engine

app.use(express.static('public'))

require('./routes/web.js')(app)


app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})