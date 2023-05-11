import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { userLogadoContext } from "../contexts/UserContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { toastSucess, toastError } from "../components/ToastMessage";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "../hooks/AuthApi";

const Register = () => {
  const { userLogado, setUserLogado } = useContext(userLogadoContext);

  const api = AuthApi();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const createUserFormSchema = z
    .object({
      name: z
        .string()
        // .regex(/[^A-Za-zÀ-ú\s]/gu, "Formato inválido")
        //quando o regex é falso ele passa a mensagem
        .nonempty("O nome é obrigatório")
        .toLowerCase()
        .regex(
          /[\u1F600-\u1F64F\u2700-\u27BF]/gu,
          "O nome não deve conter caracteres especiais"
        )
        .refine((name) => {
          const regex = /[^A-Za-zÀ-ú\s]/;
          return !regex.test(name);
        }, "O nome não deve conter caracteres especiais")
        .transform((name) => {
          return name
            .trim()
            .split(" ")
            .filter(Boolean)
            .map((word) => {
              return word[0].toLocaleUpperCase().concat(word.substring(1));
            })
            .join(" ");
        }),
      email: z
        .string()
        .nonempty("O e-mail é obrigatório")
        .email("Formato de e-mail inválido")
        .toLowerCase(),

      password: z
        .string()
        // .regex(
        //   /^(\+\d{1,3})?[-.\s]?\(?\d{2,}\)?[-.\s]?\d{4,}[-.\s]?\d{4}$/,
        //   "dasdasd"
        // )
        .nonempty("Digite uma senha de pelo menos 8 dígitos")
        // .min(8, "A senha precisa ter 8 dígitos")
        .max(32, "A senha deve ter menos de 32 dígitos")
        .refine((password) => {
          return !password.includes(" ");
          if (/\p{Emoji}/gu.test(password) || password.includes(" ")) {
            return false;
          }
          return password;
        }, "Formato de senha inválido"),
      passwordConfirm: z
        .string()
        .nonempty("Digite uma senha de pelo menos 8 dígitos")
        // .min(8, "A senha precisa ter 8 dígitos")
        .max(32, "A senha deve ter menos de 32 dígitos")
        .refine((passwordConfirm) => {
          //todo fazer isso aqui
          // const regex = /^[A-Za-z\d@$!%*#?&]$/gu;
          // if (regex.test(passwordConfirm) || passwordConfirm.includes(" ")) {
          //   return false;
          // }
          return passwordConfirm;
        }, "Formato de senha inválido"),
    })
    .superRefine(({ password, passwordConfirm }, ctx) => {
      if (password !== passwordConfirm) {
        ctx.addIssue({
          code: "custom",
          message: "Password and Confirm Password must match",
          path: ["password"],
        });
        ctx.addIssue({
          code: "custom",
          message: "Password and Confirm Password must match",
          path: ["passwordConfirm"],
        });
      }
    });
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });
  const createUser = async (data: any) => {
    try {
      console.log(data);
      await api
        .register(data.name, data.email, data.password)
        .then((response) => {
          if (response.data?.error) {
            return toastError(`${response.data.error}`);
          }
          navigate("/login");
          toastSucess("Cadastrado com sucesso");
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
  const handdleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  console.log(userLogado);
  return (
    <main className="flex justify-center items-center pt-4 pb-8 ">
      <form onSubmit={handleSubmit(createUser)} className="">
        <div className="w-[400px] boxShadowOrange p-7 flex flex-col gap-5">
          <h1 className="text-4xl pl-2 border-l-[5px] font-medium border-l-primary-color">
            Register
          </h1>
          <div className="flex  flex-col gap-1">
            <label className="text-left w-full font-medium text-xl flex flex-col gap-1">
              Name:
              <input
                type="text"
                placeholder="Digite o seu nome"
                className={`${
                  errors.name && "border-red-500"
                } w-full px-2 h-8 outline-none rounded border text-base border-primary-color items-center`}
                {...register("name")}
              />
            </label>
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>
          <div className="flex  flex-col gap-1">
            <label className="text-left w-full font-medium text-xl flex flex-col gap-1">
              E-mail:
              <input
                type="text"
                placeholder="Digite o seu e-mail"
                className={`${
                  errors.email && "border-red-500"
                } w-full px-2 h-8 outline-none rounded border text-base border-primary-color items-center`}
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
                  autoComplete="off"
                  className={`${
                    errors.password && "border-red-500"
                  }  w-full px-2 h-8 outline-none rounded border text-base border-primary-color items-center`}
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
          <div className="flex flex-col gap-1">
            <label className="text-left w-full font-medium text-xl flex flex-col gap-1">
              Confirm Password:
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Digite a sua senha"
                  className={`${
                    errors.passwordConfirm && "border-red-500"
                  }  w-full px-2 h-8 outline-none rounded border text-base border-primary-color items-center`}
                  {...register("passwordConfirm")}
                />
                <span
                  className="absolute right-2 text-3xl"
                  onClick={handdleShowConfirmPassword}
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </span>
              </div>
            </label>
            {errors.passwordConfirm && (
              <span className="text-red-500">
                {errors.passwordConfirm.message}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button className="btn">Submit</button>
            <div>
              <p>Já possui uma conta?</p>
              <Link to={"/register"} className="text-primary-color">
                <strong>Login</strong>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
};

export default Register;
