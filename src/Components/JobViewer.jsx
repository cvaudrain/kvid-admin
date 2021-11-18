import React from "react"
import {useContext, useState,useEffect} from "react"
// Components
import JobListing from "./JobListing"
import ModalEditor from "./ModalEditor"
import axios from "axios"
import { useHistory } from "react-router"

// let ModalContext;

export default function JobViewer(props){
const history = useHistory()


    const [filter,setFilter] = useState({
        completed:false,
        currString:"Active",
        navString:"Completed"
    })
    const [editMode, setEditMode] = useState(false)
    const [selectedJob, setSelectedJob] = useState(props.selectedJob)
    console.log("selected job:")
console.log(selectedJob)
const [jobArray,setJobArray] = useState([{
    _id:"loading",
        id: "loading...",
        jobName: "loading...",
        description:"loading...",
        price:"loading...",
        priceInCents:"loading...",
        customerName: "loading...",
        confirmationCode: "loading...",
        completed: "loading...",
        paid: "loading...",
        notes:"loading...",
        completed:"loading...",
        index:"loading"
}])
//get jobs from db
// useEffect wrapper to fetch only once
// ModalContext = React.createContext(selectedJob)
useEffect(()=>{
     axios.post("/api/renderJobList",filter)
    .then((res)=>{
        console.log(res.data)
        jobArray !== res.data && setJobArray(res.data)
    })
    .catch((err)=>console.log(err))
},[filter])

// useEffect(()=>{ //provide selectedJob context to child component ModalEditor
//     ModalContext = React.createContext(selectedJob)

// },[selectedJob])

// CRUD Ops Client-Side
// READ / RENDER

// DELETE
let deleteJob = (ev)=>{
console.log(ev.target.parentElement.parentElement.parentElement.parentElement.id)
let deletionId = ev.target.parentElement.parentElement.parentElement.parentElement.id
axios.post("/api/deleteJob",{
message:"edit PUT call",
deletionId:deletionId})
.then((res)=>{
    console.log(".then statement to re-render state")
    axios.post("/api/renderJobList",filter)
    .then((res)=>{
        console.log(res.data)
        jobArray !== res.data && setJobArray(res.data)
    })
    .catch((err)=>console.log(err))
})
.catch((err)=>console.log(err))
}

let editJob = (ev)=>{
    console.log("editJob()")
    let jobId = ev.target.parentElement.parentElement.parentElement.parentElement.id
 console.log(`Job ID = ${jobId}`)
     let matched = jobArray.filter((n,i)=>{
         return n._id == jobId
     })
     console.log("matched")
     matched = matched[0]
     console.log(matched[0])
        
        // console.log(`Match = ${match}`)
        setSelectedJob(
            matched
        //     id: job.id,
        // jobName: job.jobName,
        // description:job.description,
        // price:job.price,
        // priceInCents:job.priceInCents,
        // customerName: job.customerName,
        // confirmationCode: job.confirmationCode,
        // completed: job.completed,
        // paid: job.paid,
        // notes:job.notes,
        // completed:job.completed
        )
        
   
   
    // setSelectedJob(selectedJob) //selected Job will prefill values on Modal Scereen
    setEditMode(true)
}
//Mark Job Complete
 let completeJob = (ev) =>{
    console.log("Mark Complete Click")
    let jobId = ev.target.parentElement.parentElement.parentElement.parentElement.id
 console.log(`Job ID = ${jobId}`)
 let index;
 let matched = jobArray.filter((n,i)=>{ //return array with single value for matching job (matching id)
    index = i
    return n._id == jobId
})
// console.log("matched")
// console.log(matched)
matched = matched[0]
if(filter.completed === false){
    matched.completed = true
   } else{
       matched.completed = false
   }
matched.id=matched._id

let payload = {
    formVal:matched
  }

  
  axios.post("/api/editJob",payload) //post to server as normal edit; Update Operation to DB
  .then((res)=>{
    console.log(res.data)
    
   updateList()
  })
  .catch((err)=>console.log(err))

}

 let unCompleteJob = (ev) =>{
    console.log("Mark UNComplete Click")
    let jobId = ev.target.parentElement.parentElement.parentElement.parentElement.id
 console.log(`Job ID = ${jobId}`)
 let index;
 let matched = jobArray.filter((n,i)=>{ //return array with single value for matching job (matching id)
    index = i
    return n._id == jobId
})
// console.log("matched")
// console.log(matched)
matched = matched[0]
if(filter.completed === false){
 matched.completed = true
} else{
    matched.completed = false
}
matched.id=matched._id

let payload = {
    formVal:matched
  }
  axios.post("/api/editJob",payload) //post to server as normal edit; Update Operation to DB
  .then((res)=>{
    console.log(res.data)
   updateList()
  })
  .catch((err)=>console.log(err))
}

let closeEditor = ()=>{
    console.log("CLOSE modal")
    axios.post("/api/renderJobList",filter)
    .then((res)=>{
        console.log(res.data)
        jobArray !== res.data && setJobArray(res.data)
    })
    .catch((err)=>console.log(err))
    setEditMode(false)
    console.log()
}

let updateList = ()=>{
    axios.post("/api/renderJobList",filter)
    .then((res)=>{
        console.log(res.data)
        jobArray !== res.data && setJobArray(res.data)
    })
    .catch((err)=>console.log(err))
}

let toggleList =()=>{
    console.log(filter)
if (filter.completed === true){
    setFilter({
        completed : false,
        currString:"Active",
        navString:"Completed"
       
    })
} else{
    setFilter({
        completed: true,
        currString:"Completed",
        navString:"Active"
    })
}
}
    return(
        <div className="">
        <div className="centered pad-b">
        <div className="content-card theGoodShading "> <h1>{filter.currString} Jobs</h1></div>
        <div className = "content-card-wide magenta-gradient white theGoodShading"><h4>Welcome to the Demo! (And congrats on skipping our Passport.js authentication login screen to see the admin side of this app!) <br/> Work orders the admins create will populate here. The confirmation code for each job will be sent to the customer/client, and they can enter it in the <strong>customer-facing payment portal</strong> to complete payments with our Stripe integration! <br/>Click the button below to see that demo in action (on the payment screen, you can enter "42" repeatedly in the card num, cvc and exp date to simulate a successful payment).</h4>
        <a href="https://calm-brook-48041.herokuapp.com" target="_blank"><button className="theGoodShading filter-btn br-gradient-aqua padding-sm">Payment Demo</button></a>
        </div>
           <div classname = "content-card theGoodShading"><h3></h3>
           <button onClick={toggleList} className="theGoodShading filter-btn magenta-gradient padding-sm">Show {filter.navString} Jobs</button>
           </div>

            <div className="container centered">

            {editMode ? <ModalEditor 
            toggleModal= {closeEditor}
            id={selectedJob._id}
                jobName={selectedJob.jobName}
                price={selectedJob.price}
                customerName={selectedJob.customerName}
                description={selectedJob.description}
                notes={selectedJob.notes}
                paid={selectedJob.paid}
                completed={selectedJob.completed}
                confirmationCode={selectedJob.confirmationCode}
                
            />
            :
            null}

           {jobArray.map((job,ind)=>{
          
               
                return <JobListing 
                // listIndex={ind}
                id={job._id}
                jobName={job.jobName}
                price={job.price}
                customerName={job.customerName}
                description={job.description}
                notes={job.notes}
                paid={job.paid}
                completed={job.completed}
                confirmationCode={job.confirmationCode}
                index={job.index}
                delete={deleteJob}
                edit={editJob}
                markComplete={completeJob}
                filterString={filter.navString}
            />})
           }
              
            </div>
        </div>
        
        <footer class="centered">
        <div class="pad-t">
        <p class="">Ken Vaudrain Illustration & Design</p>
<p>2021-2022</p>
<p class="pad-t"><a href="https://www.kvidesign.com/home">Visit Main Site</a></p>
</div>
    </footer>
        </div>
    )
}

// export {ModalContext}