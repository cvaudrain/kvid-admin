import {useContext, useState,useEffect} from "react"

export default function JobListing(props){

    return(
        <div className="centered">
        <div id={props.id} name={props.listIndex} className="content-card-xl theGoodShading padding">
        <div className="row">
            <div className="col">
                <div className=""><h2>Job Name: <br/><span className="job-name">{props.jobName}</span></h2></div>
            </div>
            
        </div>
        <div className="row ul">
            
            <div className="col">
                <div className=""><p>Customer: <br/><span className="job-value">{props.customerName}</span></p></div>
            </div>
            <div className="col">
                <div className=""><p>Price: <br/>$<span className="job-value">{props.price}</span></p></div>
            </div>
        </div>
        <div className="row ul">
            <div className="col">
                <div className=""><p>Job ID: <br/><span className="job-value">{props.id}</span></p></div>
            </div>
            <div className="col">
                <div className=""><p>Confirmation Code: <br/><span className="job-value">{props.confirmationCode}</span></p></div>
            </div>
            
        </div>
        <div className="row ul">
            <div className="col">
                <div className=""><p>Paid?:<br/><span className="job-value">{props.paid}</span></p></div>
            </div>
            <div className="col">
                <div className=""><p>Complete?:<br/><span className="job-value">{props.completed}</span></p></div>
            </div>
            
        </div>
        <div className="row ul">
            
            <div className="col">
                <div className=""><p>Details: <br/><span className="job-value">{props.description}</span></p></div>
            </div>
        </div>
        <div className="row ul">
            <div className="col">
                <div className=""> <p>Other Notes: <br/><span className="job-value">{props.notes}</span></p></div>
            </div>
        </div>
        {/* Delete/Edit Etc. */}
        <div className="option-row row">
        <div className="col-12">
        <button className="peach-gradient save-btn theGoodShading" onClick={props.edit}><i class="fas fa-2x fa-pencil-alt "></i></button>
        <button className="magenta-gradient save-btn theGoodShading" onClick={props.delete}><i class="fas fa-2x fa-trash-alt "></i></button>
        
        
        </div>
        <div className="col-12  top-space-xs">
        <button className=" br-gradient-aqua inset theGoodShading" onClick={props.delete}><i class="far fa-2x fa-check-circle"></i></button>
        <p className="italic no-margin">Mark Complete</p>
        </div>
        </div>
        </div>
        </div>
        
    )
}