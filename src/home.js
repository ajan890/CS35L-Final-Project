import "./index.js"

function Home()
{
    return (
        
        <html>

        <img id="background_one" src={require("./pen_and_notebook.jpg")} alt="Something's Wrong!"></img> 

        <div id="top_overlay">
            <div id="title_text">A CS35L Project</div>
            <div id="title_subtitle">Brought to you by a group of humble nerds</div>
        </div>
        


        <img id="background_two" src={require("./royce_hall.jpg")} alt="You done fucked up kid"></img>

        <div id="login_title">Join the Network</div>
        <div id="login_description">
        For those small requests that just aren't worth your time, your fellow bruins got your back.<br></br>        
        Or perhaps lend a helping hand, and help bring joy to the community</div>

        <form action={'/login'}>
            <button id="login_button" type="submit">Login</button>
        </form>



        <div id="Features">Our Features</div>



        <img id="background_three" src={require("./snowy_mountain.jpg")} alt="Where the mountains at"></img>
        
        <div id="features_container">
            <div class="feature_element">
                <div class="feature_number">&nbsp;&nbsp;&nbsp;1</div>
                <div class="feature_title">
                    Make your own<br></br>
                    Requests
                </div>
                <div class="feature_text"><br></br><br></br>
                    Missed an item on your last<br></br>
                    shopping trip due to ADHD<br></br> 
                    or don't feel like leaving<br></br> 
                    the dorm because of crippling<br></br> 
                    anxiety and depression? Submit<br></br> 
                    a request in 10 quick seconds<br></br> 
                    and have the neurotypicals go<br></br> 
                    do it for you!
                </div>
            </div>
            <div class="feature_element">
                <div class="feature_number">&nbsp;&nbsp;&nbsp;2</div>
                <div class="feature_title">
                    Fulfill Requests<br></br>
                    from Others
                </div>
                <div class="feature_text"><br></br><br></br>
                    We know you just love being<br></br>
                    in the sunlight, and getting<br></br> 
                    fit. You're already taking 15k<br></br> 
                    steps a day, why not help a<br></br> 
                    fellow Bruin out along the way?<br></br> 
                    Browse requests from the<br></br> 
                    Dashboard and earn some easy<br></br>
                    cash!
                </div>
            </div>
            <div class="feature_element">
                <div class="feature_number">&nbsp;&nbsp;&nbsp;3</div>
                <div class="feature_title">
                    Go get that<br></br>
                    Bounty
                </div>
                <div class="feature_text"><br></br><br></br>
                    Got a lil competitive spirit<br></br>
                    in ya? Need some extra money<br></br> 
                    outside of the three jobs you're<br></br> 
                    already working to afford UCLA<br></br> 
                    tuition? Worry not! Our bounty<br></br> 
                    system makes sure to reward<br></br> 
                    consistent fulfillers who help<br></br> 
                    keep the system going.
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
                by picking up a couple of things along the way? Since you're still reading, here's a picture of a laptop and some<br></br> 
                coffee I found off of google just like all of the other images above. Looks nice, doesn't it? Just like this webpage,<br></br> 
                I'm sure.
            </div>
        </div>
        


        <div id="footer">
            <img id="footer_img" src={require("./coffee_laptop.jpg")} alt="Coffee's gone"></img>
            <div id="footer_text">
                CS35L Final Project © 2022 No Showers | No Rights Reserved | Contact: Joe Mama
            </div>
        </div>

        </html>
    );
}

//<a href={'/requests'}>Requests</a>

//<a href={'/'}>Home</a>

export default Home