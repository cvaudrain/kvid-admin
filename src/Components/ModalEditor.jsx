import React from "react"
import {useContext, useState,useEffect} from "react"
import styles from "../styleobjects" //Use to set conditional styling like err messages etc
import messages from  "../uimessages"
import axios from "axios"
// import {ModalContext} from "./JobViewer"
export default function ModalEditor(props){

//     let provider = useContext(ModalContext)
//    console.log("provider")
//    console.log(provider)
    const [formData, setFormData] = useState({
        jobName:props.jobName,
        price:props.price,
    customerName:props.customerName,
      description:props.description,
      notes:props.notes,
      id:props.id,
      priceInCents:props.priceInCents
    //     jobName:"",
    //     price:"",
    // customerName:"",
    //   description:"",
    //   notes:"",
    //   id:"",
    //   priceInCents:""
    })
    console.log("Modal:")
    console.log(formData)
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
    
   //validation and conditional styling
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
//

        let sendForm = (ev)=>{
            ev.preventDefault();
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
            } //OTHERWISE continue to submit

            let payload = {
              formVal:formData
            } //Update priceInCents to ensure match price- Stripe object calcs payment amt in incrmt of USD 0.01
            payload.formVal.priceInCents = payload.formVal.price*100;
            
            axios.post("/api/editJob",payload)
            .then((res)=>{
              console.log(res.data)
              props.toggleModal() //raise up state for function call
            })
            .catch((err)=>console.log(err))
          }
    
       

    return(
        <div className="ev-modal">
            <div classname="ev-modal-content">
{/* MODAL */}

    <div className="">
    <div className="centered">
            <div className="content-card-sm theGoodShading "> <h1>Edit Work Order</h1></div>
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
          <input style={highlightStyle.jobName} onChange={handleChange} name="jobName" placeholder="Job Name" required={true} value={formData.jobName} />
    <input style={highlightStyle.price} onChange={handleChange} name="price" placeholder="Price" required={true}  value={formData.price}/>
    <input style={highlightStyle.customerName} onChange={handleChange} name="customerName" placeholder="Client Name" required={true} value={formData.customerName}/>
        <input onChange={handleChange} value={formData.description} name="description" placeholder="Job Description" />
        <textarea onChange={handleChange} value={formData.notes} name="notes" placeholder="Notes" className="centered" />
    
        <div className="option-row row">
        <div className="col-12">
        <button className="save-btn br-gradient-gray theGoodShading" onClick={sendForm}><i className="fas fa-2x fa-save icon-pad"></i></button>        
        <button className="save-btn br-gradient-gray theGoodShading" onClick={props.toggleModal}><i className="fas fa-2x fa-times icon-pad"></i></button>
        </div>
        </div>
           
          </form>
          
          </div>
    
{/* Modal */}
            </div>
        </div>
    )
}

