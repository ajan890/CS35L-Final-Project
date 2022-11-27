import "./navbar.css"
import NavbarUserWidget from "./navbarUserWidget";

export default function Navbar () {
    return (
        <div id="navbar">
            <div id="leftNavBar">
                <input
                    onClick={() => {window.location.href = '/'}}
                    id="logo"
                    type="image"
                    src="https://placekitten.com/120/30"
                />
            </div>
            <div id="centerNavBar"/>
            <div id="rightNavBar">
                <NavbarUserWidget/>
            </div>

        </div>
    )
}