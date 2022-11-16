import "./index.js"

function Home()
{
    return (
        <html>

        <form action={'/login'}>
            <button class="login" type="submit">Login</button>
        </form>

        <a href={'/requests'}>Requests</a>

        <a href={'/'}>Home</a>

        <div>This is Home</div>
        <img class="background" src={require("./royce_hall.jpg")} alt="You done fucked up kid"></img>
        </html>
    );
}

export default Home