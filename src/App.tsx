import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthApi } from "./hooks/AuthApi";
import Footer from "./components/Footer";
import { useEffect, useContext } from "react";
import { userLogadoContext } from "./contexts/UserContext";

function App() {
  const api = AuthApi();
  const { setUserLogado } = useContext(userLogadoContext);
  useEffect(() => {
    const getUserInfo = async () => {
      await api
        .userInfo()
        .then((response) => {
          setUserLogado(response.data);
        })
        .catch((error) => {
          console.log(error);
          setUserLogado({ id: null, name: null, email: null, logado: false });
        });
    };
    getUserInfo();
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
