require("dotenv").config();
const express = require("express");
var session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors")
const app = express()
// const app2 = express()
const DB = "kvidjobs"
const PORT = process.env.PORT || 4747
//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors())
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:"brambleChronicle"
}))
app.use(passport.initialize())
app.use(passport.session())
// app.use(express.static(__dirname))
app.use(express.static(path.join(__dirname,".././build","index.html"))) //use build dir
app.use(express.static(path.join(__dirname,".././public"))) //Fixes MIME Type Error on delivery
//GET Single Page App Index File from build in production
app.get("*",(req,res)=>{ //can use "*" instead of "/" if issues arise
    res.sendFile(path.join(__dirname,".././build","index.html")) //deliver index.html from prod build dir
})

//Establish DB Connection

//FOR BUILD//
// mongoose.connect(process.env.DB_URL+DB,{
//     useUnifiedTopology: true,
//    useNewUrlParser: true,
//    useCreateIndex: true,
//    useFindAndModify: false,
//    connectTimeoutMS: 10000
// })

//FOR LOCAL ONLY testing connection to Mongo//
mongoose.connect("mongodb://localhost:27017/"+DB,{
   useUnifiedTopology: true,
   useNewUrlParser: true,
   connectTimeoutMS: 10000
   //    useCreateIndex: true, deprecated
//    useFindAndModify: false, deprecated
});
//Connect to DB or Handle Err
mongoose.connection.on("error",(error)=>console.log(error))
mongoose.connection.once("open",()=>console.log(`Connected to database: ${DB}`))

const Order = new mongoose.Schema( //matches Schema in Client Application which connects to same DB (only for READ operation)
    {
        // id: Number,
        jobName: String,
        description:String,
        price:Number,
        priceInCents:Number,
        customerName: String,
        confirmationCode: String,
        completed: String,
        paid: String,
        notes:String
    },
    {collection: "jobList"}
)
const CompletedJob = new mongoose.Schema( //matches Schema in Client Application which connects to same DB (only for READ operation)
    {
        id: Number,
        jobName: String,
        description:String,
        price:Number,
        priceInCents:Number,
        customerName: String,
        confirmationCode: String,
        completed: String,
        paid: String,
        notes:String
    },
    {collection: "completedJobs"}
)
const DeletedJob = new mongoose.Schema( //matches Schema in Client Application which connects to same DB (only for READ operation)
    {
        id: Number,
        jobName: String,
        description:String,
        price:Number,
        priceInCents:Number,
        customerName: String,
        confirmationCode: String,
        completed: String,
        paid: String,
        notes:String
    },
    {collection: "deletedJobs"}
)
const Administrator = new mongoose.Schema(
    {
        username:String,
        Password:String
    },
    {collection:"kvidAdmins"}
)
//Passport config for mongoose integration, local strategy
Administrator.plugin(passportLocalMongoose) //MUST come before declaring Mongoose Model, after Delcaring Schema

let OrderModel = mongoose.connection.model("OrderModel",Order)
let CompletedJobModel = mongoose.connection.model("CompletedJobs",CompletedJob)
let DeletedJobModel = mongoose.connection.model("DeletedJobs",DeletedJob)
let AdministratorModel = mongoose.connection.model("AdministratorModel",Administrator)
passport.use(AdministratorModel.createStrategy()) //4 Create Strategy 
passport.serializeUser(AdministratorModel.serializeUser())
passport.deserializeUser(AdministratorModel.deserializeUser())

//Server Listener on assigned Port
app.listen(PORT,()=>{
    console.log(`Connected to Express server on port: ${PORT}`)
})

//API Calls
//TestFn
app.post("/api/nuke",(req,res)=>{
    console.log(req.body)
    OrderModel.deleteMany({},(err,doc)=>{
        if(err){
            console.log(err)
        }
    })
    res.json("DB Empty")
})
//Add Job/Order && save to DB
app.post("/api/addJob",(req,res)=>{
    console.log("post to /api/addJob received from client")
    // Receive payload with job object
    let jobData = req.body.formVal
    console.log(jobData)
    //Generate unique ID/Conf code
    console.log(new Date().toString().split(" ").slice(1,3).join("-")+`-${jobData.inputJobName}`)
    //Save() job object to DB 
    OrderModel.find({},(err,docs)=>{
        if(err){
            console.log(err)
            res.status(500)
        } else{
            
            let length;
            if(docs.length == false){
                length = 0
            }else{
                length = docs.length + 1
            }
            jobData.id = `00${length}`
        jobData.price = +jobData.price
        jobData.priceInCents = jobData.price * 100
        jobData.confirmationCode=new Date().toString().split(" ").slice(1,3).join("")+`-${jobData.id}`
        console.log(jobData)
        // jobData.save()
        res.json(jobData)
        let newJob = new OrderModel({
            // id: jobData.id,
        jobName: jobData.jobName,
        description:jobData.description,
        price:jobData.price,
        priceInCents:jobData.priceInCents,
        customerName: jobData.customerName,
        confirmationCode: jobData.confirmationCode,
        completed: "false",
        paid: "false",
        notes:jobData.notes
        })
        newJob.save()
        console.log("complete")
        }
      
    })
    
})

//Delete Job/Order

app.post("/api/renderJoblist",(req,res)=>{
    console.log("post req from client recieved at /api/renderJoblist")
    console.log(req.body.completed)
    //query DB for all active/inactive jobs depending on req.body.completed filter
    OrderModel.find({completed:req.body.completed},(err,docs)=>{
    if(err){
        console.log(err)
        res.json(
            {
                id: "no data...",
                    jobName: "no data...",
                    description:"no data...",
                    price:"no data...",
                    priceInCents:"no data...",
                    customerName: "no data...",
                    confirmationCode: "no data...",
                    completed: "no data...",
                    paid: "no data...",
                    notes:"no data..."
            }
        )
    }else{
        res.json(docs)
    }
    })
    //res.json array of all jobs to be mapped/returned inside <Job /> Functional Component in render phase

})

app.post("/api/deleteJob",(req,res)=>{
    console.log("post req from client recieved at /api/deleteJob")
    //receive payload with job obj
    console.log(req.body.deletionId)
    OrderModel.findOneAndDelete({_id:req.body.deletionId},(err,doc)=>{
        if(err){
            console.log(err)
            res.json(err)
        } else if(!doc){
          res.json("error")
        } else if(doc){
            console.log("deleted")
            
        }
    })
  OrderModel.find({},(err,docs)=>{
      if(err){console.log(err)
    } else if(!docs){console.log("mongoose query failed")
} else{
    res.json(docs)
}
  })
  
    //query DB and delete document (or maybe keep it, but mark as DELETED in case of mistake?)
    
})
app.post("/api/editJob",(req,res)=>{
    console.log("post req from client recieved at /api/editJob")
    //receive payload with job obj
    let updated = req.body.formVal
   
    console.log(updated)
    OrderModel.findByIdAndUpdate(updated.id,updated,(err,doc)=>{
        if(err){
            console.log("ERROR")
            console.log(err)
            res.status(500)
        } if(!doc){
            console.log("Query returned 0 matches")
        }
        else if(doc){
            console.log("FOUND")
            console.log(doc)
            console.log(updated)
           res.json(`Updated from ${doc} to ${updated}`)
           
        }
    }
    )
})


// Deliver Non-React Customer-Facing Payment Portal via Express

app.get("/payments",(req,res)=>{
    res.sendFile(path.join(__dirname,".././public","/payments.html"))
})


