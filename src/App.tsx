import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthApi } from "./hooks/AuthApi";
import "./App.css";
import Footer from "./components/Footer";
import { useEffect, useContext } from "react";
import { userLogadoContext } from "./contexts/UserContext";

function App() {
  const api = AuthApi();
  const { userLogado, setUserLogado } = useContext(userLogadoContext);
  useEffect(() => {
    api.userInfo().then((response) => {
      console.log(response.data);
      setUserLogado(response.data);
    });
  }, []);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
