import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CircuitTestPanel from "./components/CircuitTestPanel.jsx";

function App() {
  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <Header />
      <CircuitTestPanel />
      <Footer />
    </div>
  );
}

export default App;