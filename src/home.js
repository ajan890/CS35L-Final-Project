import "./index.js"

function Home()
{
    return (
        <html>
        <img class="background_one" src={require("./pen_and_notebook.jpg")} alt="Something's Wrong!"></img>

        <div class="top_overlay">
            <div class="title_text">A CS35L Project</div>
        </div>
        
        <div class="login_title">Join the Network</div>
        <div class="login_description">
        For those small requests that just aren't worth your time, your fellow bruins got your back.<br></br>        
        Or perhaps lend a helping hand, and help bring joy to the community</div>

        <form action={'/login'}>
            <button class="login_button" type="submit">Login</button>
        </form>

        <a href={'/requests'}>Requests</a>

        <a href={'/'}>Home</a>

        <img class="background_two" src={require("./royce_hall.jpg")} alt="You done fucked up kid"></img>
        </html>
    );
}

export default Home