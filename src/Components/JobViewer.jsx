import {useContext, useState,useEffect} from "react"
// Components
import JobListing from "./JobListing"
import ModalEditor from "./ModalEditor"
import axios from "axios"
import { useHistory } from "react-router"

export default function JobViewer(props){
const history = useHistory()
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

useEffect(()=>{
     axios.post("/api/renderJobList","Requesting Jobs")
    .then((res)=>{
        console.log(res.data)
        jobArray !== res.data && setJobArray(res.data)
    })
    .catch((err)=>console.log(err))
},[])


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
    axios.post("/api/renderJobList","Requesting Jobs")
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
    let jobId = ev.target.parentElement.parentElement.parentElement.parentElement._id
 console.log(`Job ID = ${jobId}`)
     let matched = jobArray.filter((n,i)=>{
         return n._id = jobId
     })
        
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

let closeEditor = ()=>{
    setEditMode(false)
}

    return(
        <div className="">
        <div className="centered pad-b">
        <div className="content-card theGoodShading "> <h1>Jobs</h1></div>
           
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

           { jobArray.map((job,ind)=>{

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
            />
            
})}
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