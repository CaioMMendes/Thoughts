import logo from "/assets/thoughts_logo.png";
import { useContext } from "react";
import { userLogadoContext } from "../contexts/UserContext";
import Cookies from "js-cookie";
import { AuthApi } from "../hooks/AuthApi";
import { toastSucess } from "../components/ToastMessage";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const api = AuthApi();
  const navigate = useNavigate();
  const location = useLocation();
  const { userLogado, setUserLogado } = useContext(userLogadoContext);
  const handleSessionCookie = async () => {
    try {
      Cookies.remove("session");
      await api
        .logout()
        .then(() => {
          toastSucess("Deslogado com sucesso");
        })
        .catch((err) => {
          console.log(err);
        });
      setUserLogado({ id: null, name: null, email: null, logado: false });
      const url = location.pathname;
      if (url === "/dashboard" || url === "/thoughts") {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <header>
      <nav>
        <div className=" flex flex-row px-5 py-6 mb-4 justify-between items-center bg-[#222] border-b border-b-primary-color">
          <a href="/">
            <img src={logo} alt="Thoughts logo" className="h-10" />
          </a>
          <ul className=" flex flex-row items-center gap-3 font-medium">
            <li className="hover:text-primary-color duration-500">
              <a href="/">Pensamentos</a>
            </li>
            <li className="hover:text-primary-color duration-500">
              {userLogado.email !== null ? (
                <a href="/dashboard">Dashboard</a>
              ) : (
                <a href="/login">Login</a>
              )}
            </li>
            <li className="hover:text-primary-color duration-500">
              {userLogado.email !== null ? (
                <span className="cursor-pointer" onClick={handleSessionCookie}>
                  Logout
                </span>
              ) : (
                <a href="/register">Register</a>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
