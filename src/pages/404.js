import React from "react";

//This is the deault page that gets loaded if the URL could not be found
class ErrorPage extends React.Component
{
    render(){
        return(
            <div>
                <h1>
                Achievement Get: <br></br>
                How did we get here?
                </h1>
                <a href="/">Return to Home</a>
            </div>
        );
    }
}

export default ErrorPage