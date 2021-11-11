import { Switch, Route, Link, Redirect,useLocation, useHistory } from "react-router-dom";

export default function Header(props){
const history = useHistory();
    return(
        <div>
        <header>
            <div class="container">
            <div class="row">
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
    <img src="Images/logo.jpg" class=" padding logo-format" />
    
    
    
    <p class="centered header-text ">Hello, Ken</p>
    <p class="centered md-text glowtext">Admin Portal</p>
    </div>
    <div className={props.alignment}>
    <button onClick={()=>history.push(props.navArg)} className="pill theGoodShading bottom-space-sm" style={{background:"inherit"}}> <p className="md-text glowtext">{props.buttonText}</p><i class={props.faClass}></i></button>
    </div>
</div>
</div>
        </header>
        </div>
    )
}