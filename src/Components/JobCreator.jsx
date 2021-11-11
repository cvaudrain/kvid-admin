import {useContext, useState,useEffect} from "react"
// import React from "react"
import axios from "axios"

export default function JobCreator(props){
const [formData, setFormData] = useState({
    jobName:"",
    price:"",
customerName:"",
  description:"",
  notes:"",
  id:"",
  priceInCents:""  
})

let handleChange = (ev) =>{
const {name,value} = ev.target
setFormData((prev)=>{
return {
...prev,
[name]:value
}
}
)
}

    let sendForm = (ev)=>{
        ev.preventDefault();
        let payload = {
          formVal:formData
        }
        axios.post("/api/addJob",payload)
        .then((res)=>{
          console.log(res.data)
        })
        .catch((err)=>console.log(err))
      }

    let nukeDatabase = (ev)=>{
        ev.preventDefault()
        let payload = "Delete"
        axios.post("/api/nuke",payload)
        .then((res)=>{
            console.log(res)
        })
        .catch((err)=>console.log(err))
    }
return(
<div className="">
<div className="centered">
        <div className="content-card-sm theGoodShading "> <h1>Create Work Order</h1></div>
           
        </div>
      <form id="job-form" className="theGoodShading">
        <input onChange={handleChange} name="jobName" placeholder="Job Name" required={true} />
    <input onChange={handleChange} name="price" placeholder="Price" required={true} />
    <input onChange={handleChange} name="customerName" placeholder="Client Name" required={true}/>
    <input onChange={handleChange} name="description" placeholder="Job Description" />
    <textarea onChange={handleChange} name="notes" placeholder="Notes" className="centered" />

        <button className="save-btn br-gradient-gray theGoodShading" onClick={sendForm}><i className="fas fa-2x fa-save"></i></button>
      </form>
      <button className="save-btn br-gradient-aqua" onClick={nukeDatabase}> !Nuke DB!</button>
      </div>
)
}