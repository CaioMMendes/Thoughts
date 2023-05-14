import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { userLogadoContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "../hooks/AuthApi";
import { toastSucess, toastError } from "../components/ToastMessage";

const Thoughts = () => {
  const api = AuthApi();
  const navigate = useNavigate();
  const { userLogado } = useContext(userLogadoContext);
  useEffect(() => {
    ("");
  }, []);
  if (userLogado?.logado === false) {
    console.log(userLogado);

    navigate("/login");
  }
  const createUserFormSchema = z.object({
    title: z
      .string()
      .toLowerCase()

      .transform((title) => {
        const transformedString = title.split(" ").filter(Boolean).join(" ");
        console.log(
          transformedString[0]
            .toLocaleUpperCase()
            .concat(title.substring(1))
            .trim()
        );
        return transformedString[0]
          .toLocaleUpperCase()
          .concat(transformedString.substring(1))
          .trim();
      }),
  });
  type CreateUserFormData = z.infer<typeof createUserFormSchema>;
  const {
    register,
    handleSubmit,
    reset,

    // formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });
  const createThought = async (data: any) => {
    api
      .createThought(data.title)
      .then((response) => {
        toastSucess(response.data?.message);
        reset();
      })
      .catch((error) => {
        console.log(error);
        toastError("Ocorreu um erro");
      });
  };

  return (
    <main id="container" className="pl-12 gap-8 flex flex-col ">
      <a
        href="/dashboard"
        className="text-primary-color flex w-fit border-b border-primary-color "
      >
        Voltar
      </a>
      <form onSubmit={handleSubmit(createThought)} className="mb-5">
        <div className=" w-fit gap-6 flex flex-col">
          <h1 className="text-4xl pl-2 border-l-[5px] font-medium border-l-primary-color">
            Criando um pensamento
          </h1>
          <div>
            <label>
              <p className="text-xl">Pensamento:</p>
              <input
                type="text"
                placeholder="Digite um pensamento"
                className="border border-primary-color px-2 h-8 w-full outline-none"
                {...register("title")}
              />
            </label>
          </div>
          <button className="btn">Submit</button>
        </div>
      </form>
    </main>
  );
};

export default Thoughts;
