import "./index.js"

function Home()
{
    return (
        
        <html>

        <img id="background_one" src={require("./pen_and_notebook.jpg")} alt="Something's Wrong!"></img> 

        <div id="top_overlay">
            <div id="title_text">A CS35L Project</div>
        </div>
        


        <img id="background_two" src={require("./royce_hall.jpg")} alt="You done fucked up kid"></img>

        <div id="login_title">Join the Network</div>
        <div id="login_description">
        For those small requests that just aren't worth your time, your fellow bruins got your back.<br></br>        
        Or perhaps lend a helping hand, and help bring joy to the community</div>

        <form action={'/login'}>
            <button id="login_button" type="submit">Login</button>
        </form>


        <div id="Services">Our Services</div>

        <img id="background_three" src={require("./snowy_mountain.jpg")} alt="Where the mountains at"></img>
        
        <div id="services_container">
            <div class="service_element">Bruh
                <div class="service_text"><br></br>
                My ass is nice
                </div>
            </div>
            <div class="service_element">Bruh
                <div class="service_text"><br></br>
                Some services
                </div>
            </div>
            <div class="service_element">Bruh
                <div class="service_text"><br></br>
                Not bad
                </div>
            </div>
        </div>
        
        </html>
    );
}

//<a href={'/requests'}>Requests</a>

//<a href={'/'}>Home</a>

export default Home