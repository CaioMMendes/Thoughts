import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthApi } from "../hooks/AuthApi";

interface IThought {
  id: number;
  title: string;
  userId: number;
  user: {
    id: number;
    email: string;
    name: string;
  };
}
const Home = () => {
  const api = AuthApi();
  const [allThoughts, setAllThoughts] = useState<IThought[]>();
  const [isSearching, setIsSearching] = useState({ input: "", search: false });
  const createUserFormSchema = z.object({
    search: z.string().toLowerCase(),
  });
  type CreateUserFormData = z.infer<typeof createUserFormSchema>;
  const handleAllThoughts = async () => {
    try {
      await api
        .getThoughts()
        .then((response) => {
          // console.log(response.data[0].user.name);
          console.log(response.data[0]);
          setAllThoughts(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleAllThoughts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });
  const handleSearch = async (data: CreateUserFormData) => {
    try {
      await api
        .searchThoughts(data.search)
        .then((response) => {
          console.log(response.data);
          setAllThoughts(response.data);
          setIsSearching({ input: data.search, search: true });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-height gap-5 flex flex-col">
      <span className="flex justify-center ">
        <h1 className="text-4xl pl-2 border-l-[5px] font-medium border-l-primary-color">
          Todos os pensamentos
        </h1>
      </span>
      <span className="flex justify-center">
        <form
          onSubmit={handleSubmit(handleSearch)}
          className="flex justify-center w-3/4 gap-8 "
        >
          <input
            type="text"
            className="w-full border border-primary-color px-3 rounded-md outline-none focus:ring-1 focus:ring-primary-color"
            placeholder="Digite algo"
            {...register("search")}
          />
          {errors.search && (
            <span className="text-red-500">{errors.search.message}</span>
          )}
          <button type="submit" className="btn w-32">
            Buscar
          </button>
        </form>
      </span>
      {isSearching.search === true ? (
        <div className="flex justify-center items-center flex-col">
          <h1 className="text-xl">
            Você esta buscando por:{" "}
            <strong className="text-primary-color">{isSearching.input}</strong>
          </h1>
          <p className="text-lg">
            Foram encontrados{" "}
            <strong className="text-primary-color">
              {allThoughts?.length}
            </strong>{" "}
            pensamentos
          </p>
        </div>
      ) : (
        ""
      )}

      <div className="flex gap-5 flex-col my-6">
        {allThoughts
          ? allThoughts.map((thought: IThought, index: number) => {
              return (
                <div
                  key={index}
                  className="flex border-b border-zinc-700 gap-4 items-center"
                >
                  <h1 className="text-3xl"> " {thought.title} "</h1>
                  <p>por</p>
                  <strong className="text-primary-color">
                    {" "}
                    {thought.user.name}
                  </strong>
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
};

export default Home;
