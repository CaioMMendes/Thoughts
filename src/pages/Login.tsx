import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { toastSucess, toastError } from "../components/ToastMessage";
import { AuthApi } from "../hooks/AuthApi";
import { userLogadoContext } from "../contexts/UserContext";
const Login = () => {
  const api = AuthApi();
  const { setUserLogado } = useContext(userLogadoContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const createUserFormSchema = z.object({
    email: z
      .string()
      .nonempty("O e-mail é obrigatório")
      .email("Formato de e-mail inválido")
      .toLowerCase(),

    password: z
      .string()

      .nonempty("Digite uma senha"),
    // .refine((password) => {
    //   // return !password.includes(" ");
    //   if (/\p{Emoji}/gu.test(password) || password.includes(" ")) {
    //     return false;
    //   }
    //   return password;
    // }, "Formato de senha inválido"),
  });
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });
  const loginUser = async (data: CreateUserFormData) => {
    try {
      await api
        .login(data.email, data.password)
        .then((response) => {
          if (response.data?.error) {
            return toastError(`${response.data.error}`);
          }

          setUserLogado(response.data);
          toastSucess("Logado com sucesso");
          navigate("/dashboard");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
  type CreateUserFormData = z.infer<typeof createUserFormSchema>;
  const handdleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="flex justify-center items-center pt-4 pb-8  ">
      <form onSubmit={handleSubmit(loginUser)} className="">
        <div className="w-[400px] boxShadowOrange p-7 flex flex-col gap-5">
          <h1 className="text-4xl pl-2 border-l-[5px] font-medium border-l-primary-color">
            Login
          </h1>
          <div className="flex  flex-col gap-1">
            <label className="text-left w-full font-medium text-xl flex flex-col gap-1">
              E-mail:
              <input
                type="text"
                placeholder="Digite o seu e-mail"
                className={`${
                  errors.email && "border-red-500"
                } w-full px-2 h-8 outline-none rounded border text-base border-primary-color focus:ring-1 focus:ring-primary-color items-center`}
                {...register("email")}
              />
            </label>
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-left w-full font-medium text-xl flex flex-col gap-1">
              Password:
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite a sua senha"
                  className={`${
                    errors.password && "border-red-500"
                  }  w-full px-2 h-8 outline-none rounded border text-base border-primary-color focus:ring-1 focus:ring-primary-color items-center`}
                  {...register("password")}
                />
                <span
                  className="absolute right-2 text-3xl"
                  onClick={handdleShowPassword}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
              </div>
            </label>
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button className="btn">Submit</button>
            <div>
              <p>Não possui conta?</p>
              <Link to={"/register"} className="text-primary-color">
                <strong>Cadastre-se</strong>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
};

export default Login;
