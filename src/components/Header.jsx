import logo from "../assets/logo.png";
import ExamplesMenu from "./ExamplesMenu.jsx";
import "./Header.css";

// Most items are plain links; the one marked `dropdown` renders the menu.
const NAV_ITEMS = [
    { label: "zoneq", href: "#" },
    { label: "tutorial", href: "#" },
    { label: "examples", dropdown: true },
    { label: "about", href: "#" },
    { label: "settings", href: "#" },
];

function Header({ onSelectExample }) {
    return (
        <header className="site-header">
            {/* Title card: logo next to the site name */}
            <div className="site-title" >
                <img className="site-logo" src={logo} alt="Zone logo" />

            </div>

            {/* Navigation links; the "examples" item opens a dropdown */}
            <nav className="site-nav" aria-label="Main navigation">
                {NAV_ITEMS.map(item =>
                    item.dropdown ? (
                        <ExamplesMenu key={item.label} onSelectExample={onSelectExample} />
                    ) : (
                        <a key={item.label} href={item.href}>{item.label}</a>
                    )
                )}
            </nav>


            {/* Horizontal bar closing off the header */}
            <div className="site-bar" />
            <div className="white-bar" />
            <div className="white-bar" />
            <div className="site-bar" />

        </header>
    );
}

export default Header;