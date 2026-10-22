import "./Footer.css";
import "./Header.css";

const LANGUAGES = [
    { label: "english", href: "#" },
    { label: "español", href: "#" },
    { label: "中文", href: "#" },
];

function Footer() {
    return (
        <footer className="site-footer">


            <nav className="languages" aria-label="Language selection">
                {LANGUAGES.map(link => (
                    <a key={link.label} href={link.href}>{link.label}</a>
                ))}
            </nav>

        </footer>
    );
}

export default Footer;