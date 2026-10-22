import logo from "../assets/logo.png";
import "./Header.css";

const NAV_LINKS = [
    { label: "zoneq", href: "#" },
    { label: "tutorial", href: "#" },
    { label: "github", href: "#" },
    { label: "about", href: "#" },
    { label: "buy me a coffee", href: "#" },
    { label: "settings", href: "#" },
];

function Header() {
    return (
        <header className="site-header">
            {/* Title card: logo next to the site name */}
            <div className="site-title">
                <img className="site-logo" src={logo} alt="Zone logo" />
                {/* <h1 className="site-name">zone</h1> */}

            </div>

            {/* Reserved space for navigation links, e.g. <a href="#">Tutorial</a> */}
            <nav className="site-nav" aria-label="Main navigation">
                {NAV_LINKS.map(link => (
                    <a key={link.label} href={link.href}>{link.label}</a>
                ))}
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