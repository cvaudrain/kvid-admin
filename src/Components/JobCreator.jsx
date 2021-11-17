import {useContext, useState,useEffect} from "react"
import styles from "../styleobjects" //Use to set conditional styling like err messages etc
import messages from  "../uimessages"
import axios from "axios"

export default function JobCreator(props){

  const defaultForm = { //Default Form Value
    jobName:"",
    price:"",
customerName:"",
  description:"",
  notes:"",
  id:"",
  priceInCents:""  
}
const [formData, setFormData] = useState(defaultForm)
// UI Messages
const genericAlerts = messages.universal
const incomplete = genericAlerts.incomplete

const kvidAlerts = messages.kvidAlerts
const infoStr = kvidAlerts.infoStr
const successStr = kvidAlerts.successStr
const errorStr = kvidAlerts.errorStr

const [alertMessage,setAlertMessage] = useState("info")
const [messageStyle,setMessageStyle] = useState(styles.infoMessage) //change state based on error message

const [highlightStyle,setHighlightStyle] = useState( //highlight backgrounds for required fields if left blank
  {
    jobName:{background:"inherit"},
    price: {background:"inherit"},
    customerName: {background:"inherit"}
}
  )

let form = document.getElementById("job-form") 
useEffect(()=>{ //reset form and style message on submission IF success
  if(alertMessage==="success"){
  form.jobName.value = ""
  form.price.value=""
  form.customerName.value=""
  form.description.value=""
  form.notes.value=""
  setMessageStyle(styles.successMessage)
// setFormData(defaultForm) setFormData will persist the current value even if we reset to blank
}
if(alertMessage==="error" || alertMessage ==="incomplete"){
  setMessageStyle(styles.errorMessage)
}
if(alertMessage==="info")setMessageStyle(styles.infoMessage)
},[alertMessage])

console.log(formData)
console.log(alertMessage)
let handleChange = (ev) =>{
  if(alertMessage == "success" ){
    setFormData(()=>{
      return{
      jobName:"",
      price:"",
  customerName:"",
    description:"",
    notes:"",
    id:"",
    priceInCents:""  
  }
})

  return
  }else{

  
const {name,value} = ev.target
setFormData((prev)=>{
return {
...prev,
[name]:value
}
}
)
}
}

    let sendForm = (ev)=>{
        ev.preventDefault(); //validate required fields, style UI accordingly if invalid/missing required.
      if(formData.jobName.length == 0 || formData.price.length == 0 || formData.customerName.length ==0){ //check required
        setAlertMessage("incomplete") //set UI text message
        setMessageStyle(styles.errorMessage) //set message background to error red
        formData.jobName.length == 0 ? setHighlightStyle((prev)=>{ //set highlight state to red highlight for any blank requireds
          return{
            ...prev,
            jobName: {background:"#c76b79d7"}
          }
        }) : //if filled now, reset to white background
        setHighlightStyle((prev)=>{
          return{
            ...prev,
            jobName: {background:"inherit"} //prevents staying highlighted if user fills it
          }
        })
         formData.price.length == 0 ? setHighlightStyle((prev)=>{
          return{
            ...prev,
           price: {background:"#c76b79d7"}
          }
        }) :
        setHighlightStyle((prev)=>{
          return{
            ...prev,
            price: {background:"#inherit"} //reset to normal background if filled
          }
        })
         
         formData.customerName.length ==0 ? setHighlightStyle((prev)=>{
          return{
            ...prev,
            customerName: {background:"#c76b79d7"}
          }
        }) :
        setHighlightStyle((prev)=>{
          return{
            ...prev,
            customerName: {background:"inherit"}  //reset to normal background if filled
          }
        })
        return; //prevents form submission to api
      }
      console.log("Did not return")
        let payload = {
          formVal:formData
        }
        axios.post("/api/addJob",payload)
        .then((res)=>{
          console.log(res.data)
    setAlertMessage("success") //success message styling, conditionally render appropriate text message
    setHighlightStyle({ //unhighlight all fields after success
      jobName:{background:"inherit"},
      price: {background:"inherit"},
      customerName: {background:"inherit"}
  })
        })
        .catch((err)=>{
          console.log(err)
        setAlertMessage("error")
        })
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
        <div className="content-card-sm theGoodShading"> <h1>Create Work Order</h1></div>
           <div style={messageStyle} className="content-card-sm theGoodShading">
             <p>
             {alertMessage === "info" && infoStr}
             {alertMessage === "success" && successStr}
             {alertMessage === "error" && errorStr}
             {alertMessage === "incomplete" && incomplete}
             </p>
           </div>
        </div>
      <form id="job-form" className="theGoodShading">
        <input style={highlightStyle.jobName} onChange={handleChange} name="jobName" placeholder="Job Name" required={true} />
    <input style={highlightStyle.price} onChange={handleChange} name="price" placeholder="Price" required={true} />
    <input style={highlightStyle.customerName} onChange={handleChange} name="customerName" placeholder="Client Name" required={true}/>
    <input onChange={handleChange} name="description" placeholder="Job Description" />
    <textarea onChange={handleChange} name="notes" placeholder="Notes" className="centered" />

        <button className="save-btn steelblue-fade theGoodShading" onClick={sendForm}><i className="fas fa-2x fa-save "></i></button>
      </form>
      <button className="save-btn br-gradient-aqua" onClick={nukeDatabase}> !Nuke DB!</button>
      </div>
)
}