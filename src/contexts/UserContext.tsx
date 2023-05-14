import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface IUserLogado {
  userLogado: {
    id: number | null;
    name: string | null;
    email: string | null;
    logado: boolean;
  };
  setUserLogado: Dispatch<SetStateAction<UserLogado>>;
}
interface UserLogado {
  id: number | null;
  name: string | null;
  email: string | null;
  logado: boolean;
}

export const userLogadoContext = createContext<IUserLogado>({
  userLogado: {
    id: null,
    name: null,
    email: null,
    logado: false,
  },

  setUserLogado: () => undefined,
});

interface IUserLogadoContext {
  children: ReactNode;
}

export const UserLogadoProvider = ({ children }: IUserLogadoContext) => {
  const [userLogado, setUserLogado] = useState<UserLogado>({
    id: null,
    name: null,
    email: null,
    logado: false,
  });

  return (
    <userLogadoContext.Provider
      value={{
        userLogado,
        setUserLogado,
      }}
    >
      {children}
    </userLogadoContext.Provider>
  );
};
