import {useContext, useState,useEffect} from "react"
// Components
import JobListing from "./JobListing"
import ModalEditor from "./ModalEditor"
import axios from "axios"

export default function JobViewer(props){

    const [editMode, setEditMode] = useState(false)
    const [selectedJob, setSelectedJob] = useState("")
const [jobArray,setJobArray] = useState([{
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
        completed:"loading..."
}])
//get jobs from db
// useEffect wrapper to fetch only once
useEffect(()=>{
    axios.post("/api/renderJobList","Requesting Jobs")
    
    .then((res)=>{
        console.log(res.data)
        setJobArray(res.data)
    })
    .catch((err)=>console.log(err))
},[])
   
// CRUD Ops Client-Side
let deleteJob = (ev)=>{
console.log(ev.target.parentElement.parentElement.parentElement.parentElement.id)
let deletionId = ev.target.parentElement.parentElement.parentElement.parentElement.id
axios.post("/api/deleteJob",{
message:"edit PUT call",
deletionId:deletionId})
.then((res)=>{
    console.log(res.data)
})
.catch((err)=>console.log(err))
}

let editJob = (ev)=>{
    let jobId = ev.target.parentElement.parentElement.parentElement.parentElement.id
    let selectedJob = ()=>{
        let match;
        jobArray.forEach((n,ind)=>{ //cycle through jobArray to find selected job based on jobId
            if (n.id !== jobId) console.log("not match")
            else match = n
        })
            return match //return entire job listing object
        }
   
    setSelectedJob(selectedJob) //selected Job will prefill values on Modal Scereen
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
            id={selectedJob.id}
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
                id={job.id}
                jobName={job.jobName}
                price={job.price}
                customerName={job.customerName}
                description={job.description}
                notes={job.notes}
                paid={job.paid}
                completed={job.completed}
                confirmationCode={job.confirmationCode}
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