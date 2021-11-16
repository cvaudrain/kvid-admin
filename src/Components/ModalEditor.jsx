import {useState} from "react"
import axios from "axios"

export default function ModalEditor(props){
    const [formData, setFormData] = useState({
        jobName:props.jobName,
        price:props.price,
    customerName:props.customerName,
      description:props.description,
      notes:props.notes,
      id:props.id,
      priceInCents:props.priceInCents  
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
               
            </div>
          <form id="job-form" className="theGoodShading">
            <input onChange={handleChange} value={formData.jobName} name="jobName" placeholder="Job Name" required={true} />
        <input onChange={handleChange} value={formData.price} name="price" placeholder="Price" required={true} />
        <input onChange={handleChange} value={formData.customerName} name="customerName" placeholder="Client Name" required={true}/>
        <input onChange={handleChange} value={formData.description} name="description" placeholder="Job Description" />
        <textarea onChange={handleChange} value={formData.notes} name="notes" placeholder="Notes" className="centered" />
    
        <div className="option-row row">
        <div className="col-12">
        <button className="save-btn br-gradient-gray theGoodShading" onClick={sendForm}><i className="fas fa-2x fa-save icon-pad"></i></button>        <button className="magenta-gradient save-btn" onClick={props.delete}><i class="fas fa-2x fa-trash-alt "></i></button>
        <button className="save-btn br-gradient-gray theGoodShading" onClick={()=>props.toggleModal}><i className="fas fa-2x fa-times icon-pad"></i></button>
        </div>
        </div>
           
          </form>
          
          </div>
    
{/* Modal */}
            </div>
        </div>
    )
}

