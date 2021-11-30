import { NavLink } from "react-router-dom"
// import "../../Assets/CSS/serverError.css"

const ServerError = ()=>{
    return (
        <>
            <div className="error">
                <div className="container-floud">
                    <div className="col-xs-12 ground-color text-center">
                        <div className="container-error-404">
                            <div className="clip"><div className="shadow"><span className="digit thirdDigit">5</span></div></div>
                            <div className="clip"><div className="shadow"><span className="digit secondDigit">0</span></div></div>
                            <div className="clip"><div className="shadow"><span className="digit firstDigit">0</span></div></div>
                            <div className="msg">error<span className="triangle"></span></div>
                        </div>
                        <h2 className="h1">Server Error</h2>
                    </div>
                </div>
            </div>

            <div style={{textAlign: 'center'}}>
                <NavLink to="/">
                    <button style={{fontSize: '25px'}} className="btn btn-primary">Home</button>
                </NavLink>
            </div>
        </>
    )
}

export default ServerError;