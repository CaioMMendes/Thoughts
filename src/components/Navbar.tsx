import logo from "../assets/toughts_logo.png";
const Navbar = () => {
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
              <a href="/login">Login</a>
            </li>
            <li className="hover:text-primary-color duration-500">
              <a href="/register">Register</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
