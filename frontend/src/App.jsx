import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      {/* <div className="flex flex-col min-h-screen"> */}
        <Navbar />
        {/* <main className="flex-grow"> */}
          <AppRoutes />
        {/* </main> */}
        <Footer />
      {/* </div> */}
    </BrowserRouter>
  );
}
