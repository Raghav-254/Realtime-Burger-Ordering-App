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
const Emitter=require('events')
require('dotenv').config()
const PORT= process.env.PORT || 3000
//process.env.DB_URL
const dbUrl = process.env.DB_URL;


//to run server.js use command-nodemon server.js
//to run laravel mix use command-npm run watch

//Database connection




mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const connection=mongoose.connection;
connection.once('open',()=>{
    console.log('Database connected..')
});

//Session Store
let mongoStore=new MongoDbStore({
    url:dbUrl,
    mongooseConnection:connection,
    touchAfter:24*60*60,
    collection:'sessions',
    secret: process.env.SECRET_KEY  

})

// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)


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

const server = app.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`)
})

// Socket

const io = require('socket.io')(server)
io.on('connection', (socket) => {
// Join
    //console.log(socket.id)
    //Ye client side se recieve kar rhe hai
    socket.on('join',(orderId)=>{
        //console.log(orderId)
        socket.join(orderId) //Room create kar rhe hai yaha
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced',(data)=>{
    //console.log(data)
    io.to('adminRoom').emit('orderPlaced',data)
})