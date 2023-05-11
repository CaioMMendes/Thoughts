import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface IUserLogado {
  userLogado: {
    id: number;
    name: string;
    email: string;
  } | null;
  setUserLogado: Dispatch<SetStateAction<UserLogado | null>>;
}
interface UserLogado {
  id: number;
  name: string;
  email: string;
}

export const userLogadoContext = createContext<IUserLogado>({
  userLogado: null,

  setUserLogado: () => undefined,
});

interface IUserLogadoContext {
  children: ReactNode;
}

export const UserLogadoProvider = ({ children }: IUserLogadoContext) => {
  const [userLogado, setUserLogado] = useState<UserLogado | null>(null);

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
