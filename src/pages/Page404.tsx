import Navbar from "../components/Navbar";

const Page404 = () => {
  return (
    <div className="flex h-screen flex-col">
      <div className="w-full">
        <Navbar />
      </div>
      <div className="flex justify-center items-center h-full">
        Page not found
      </div>
    </div>
  );
};

export default Page404;
