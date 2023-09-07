import { useNavigate } from "react-router-dom";
import { userLogadoContext } from "../contexts/UserContext";
import { useContext, useEffect, useState, ChangeEvent } from "react";
import { AuthApi } from "../hooks/AuthApi";
import { toastError, toastSucess } from "../components/ToastMessage";
interface IThought {
  id: number;
  title: string;
  userId: number;
}

const Dashboard = () => {
  const api = AuthApi();
  const navigate = useNavigate();
  const { setUserLogado } = useContext(userLogadoContext);
  const [isDisabledInput, setIsDisabledInput] = useState<number[]>([]);
  // const [inputThoughtTitle, setInputThoughtTitle] = useState<number[]>([]);
  const [thoughts, setThoughts] = useState<IThought[] | null>(null);
  const getUserInfo = async () => {
    try {
      const response = await api.userInfo();

      if (response?.data?.id) {
        return setUserLogado(response.data);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  useEffect(() => {
    getUserInfo();
    api
      .dashboardThoughts()
      .then((response) => {
        setThoughts(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = async (index: number, id: number) => {
    console.log(index, id);

    try {
      api
        .deleteThought(id)
        .then((response) => {
          toastSucess(response?.data?.message);
        })
        .catch((error) => {
          console.log(error);
          toastError("Algo deu errado");
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateThought = async (id: number, title: any) => {
    console.log(title);
    try {
      await api
        .updateThought(id, title)
        .then((response) => {
          toastSucess(response?.data?.message);
        })
        .catch((error) => {
          console.log(error);
          toastError("Algo deu errado");
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleThoughtTitleInput = (
    e: ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const value = e?.target?.value;

    if (thoughts !== null) {
      // setThoughts([ ...thoughts , { id: 123,title:'AxiosCredentialsEnum',userId:1}]);
      const updatedThoughts = thoughts.map((thought) => {
        if (thought.id === id) {
          return Object.assign({}, thought, {
            title: value,
          });
        }
        return thought;
      });
      setThoughts(updatedThoughts);
      console.log(updatedThoughts);
    }
  };
  return (
    <div className="px-5 flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-4xl pl-2 border-l-[5px] font-medium border-l-primary-color">
          Dashboard
        </h1>
        <button className="btn">
          <a
            href="/thoughts"
            className=" h-full justify-center items-center flex"
          >
            Criar Pensamento
          </a>
        </button>
      </div>
      <h1 className="text-2xl font-medium mb-5">Seus Pensamentos</h1>
      <div className="mb-4">
        {thoughts === null || thoughts.length === 0 ? (
          <p>
            Você ainda não tem um pensamento, para criar{" "}
            <strong
              className="text-primary-color cursor-pointer"
              onClick={() => {
                navigate("/thoughts");
              }}
            >
              Clique aqui
            </strong>
          </p>
        ) : (
          thoughts.map((thought, index) => {
            return (
              <div
                key={index}
                className="flex justify-between items-center border-b gap-10 border-primary-color p-3"
              >
                <input
                  type="text"
                  className={`
                    ${isDisabledInput.includes(thought.id)
                      ? "bg-zinc-700 border border-primary-color outline-none"
                      : ""
                    } text-xl px-3 w-full bg-[#242424]`}
                  disabled={isDisabledInput.includes(thought.id) ? false : true}
                  value={thought.title}
                  onChange={(e) => {
                    handleThoughtTitleInput(e, thought.id);
                  }}
                />
                {/* <h1 className="text-xl">{thought.id}</h1>
                <h1 className="text-xl">{thought.userId}</h1> */}
                <div className="flex flex-row gap-4">
                  {isDisabledInput.includes(thought.id) ? (
                    <button
                      className="btn w-20"
                      onClick={() => {
                        setIsDisabledInput((prevArray: any) =>
                          prevArray.filter(
                            (_: number, i: number) => i === thought.id
                          )
                        );

                        handleUpdateThought(thought.id, thought.title);
                      }}
                    >
                      Salvar
                    </button>
                  ) : (
                    <button
                      className="btn w-20"
                      onClick={() => {
                        setIsDisabledInput([...isDisabledInput, thought.id]);
                      }}
                    >
                      Editar
                    </button>
                  )}

                  <button
                    className="btn w-20"
                    onClick={() => {
                      setThoughts((prevArray: any) =>
                        prevArray.filter((_: number, i: number) => i !== index)
                      );
                      handleDelete(index, thought.id);
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;
