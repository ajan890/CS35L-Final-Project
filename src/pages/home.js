import "../index.js"
import "./home.css"

function Home()
{
    return (
        
        <html>

        <img id="background_one" src={require("./images/pen_and_notebook.jpg")} alt="Something's Wrong!"></img> 

        <div id="top_overlay">
            <div id="title_text">A CS35L Project</div>
            <div id="title_subtitle">Brought to you by a group of humble nerds</div>
        </div>
        


        <img id="background_two" src={require("./images/royce_hall.jpg")} alt="You done fucked up kid"></img>

        <div id="login_title">Join the Network</div>
        <div id="login_description">
        For those small requests that just aren't worth your time, your fellow bruins got your back.<br></br>        
        Or perhaps lend a helping hand, and help bring joy to the community</div>

        <form action={'/login'}>
            <button id="login_button" type="submit">Login</button>
        </form>



        <div id="Features">Our Features</div>



        <img id="background_three" src={require("./images/snowy_mountain.jpg")} alt="Where the mountains at"></img>
        
        <div id="features_container">
            <div class="feature_element">
                <div class="feature_number">&nbsp;&nbsp;&nbsp;1</div>
                <div class="feature_title">
                    Make your own<br></br>
                    Requests
                </div>
                <div class="feature_text"><br></br><br></br>
                    We've all had those moments,<br></br>
                    when you just need a small  <br></br>
                    item from the UCLA store or <br></br>
                    want a boba delivered without<br></br>
                    small order fees. Join our  <br></br>
                    network and submit a request<br></br>
                    for small item you want in  <br></br>
                    under 10 seconds!
                </div>
            </div>
            <div class="feature_element">
                <div class="feature_number">&nbsp;&nbsp;&nbsp;2</div>
                <div class="feature_title">
                    Fulfill Requests<br></br>
                    from Others
                </div>
                <div class="feature_text"><br></br><br></br>
                    Love lending people a helping<br></br>
                    hand and contributing to the <br></br>
                    community? Then this service <br></br>
                    is for you! Browse a list of <br></br>
                    all requests made by your    <br></br>
                    fellow Bruins on your dashboard<br></br> 
                    and find ones you are able to<br></br>
                    help with.
                </div>
            </div>
            <div class="feature_element">
                <div class="feature_number">&nbsp;&nbsp;&nbsp;3</div>
                <div class="feature_title">
                    Go get that<br></br>
                    Bounty
                </div>
                <div class="feature_text"><br></br><br></br>
                    Got a lil competitive spirit <br></br>
                    in ya? Looking to earn a little<br></br> 
                    extra money on the side without<br></br> 
                    spending too much time? Worry <br></br>
                    not! Our bounty system makes  <br></br>
                    sure to reward consistent     <br></br>
                    fulfillers who help keep the  <br></br>
                    system going.
                </div>
            </div>
        </div>



        <div id="propoganda">
            <div id="propoganda_title">
                From Bruins, to Bruins
            </div>
            <div id="propoganda_slogan"><br></br>
                Still better than USC
            </div>
            <div id="propoganda_text"><br></br>
                We came up with this idea totally on the fly since we needed something for our CS35L project but it actually ended<br></br>
                up sounding like a pretty great community connection project that would never work in real life due to the amount of<br></br> 
                trust each individual would have to have towards every other individual. But hey, that's what dreams (and CS class<br></br> 
                projects) are for right. With the amount of walking around you have to do everyday, why not help a fellow Bruin out<br></br> 
                by picking up a couple of things along the way? Since you're still reading, here's a picture of a laptop and some<br></br> 
                coffee I found off of google Looks nice, doesn't it? Just like this webpage, I'm sure. #UAW STRIKE
            </div>
        </div>
        


        <div id="footer">
            <img id="footer_img" src={require("./images/coffee_laptop.jpg")} alt="Coffee's gone"></img>
            <div id="footer_text">
                CS35L Final Project © 2022 No Showers | No Rights Reserved | Contact: Joe Mama
            </div>
        </div>

        </html>
    );
}

export default Home