import Client from "pocketbase";
import { createContext, type JSX, useContext } from "solid-js";

const PocketBaseContext = createContext<Client>();

export const PocketBaseProvider = (props: {
  url: string;
  children: JSX.Element;
}) => (
  <PocketBaseContext.Provider value={new Client(props.url)}>{props.children}
  </PocketBaseContext.Provider>
);

export const usePocketbase = () => {
  const context = useContext(PocketBaseContext);
  if (context === undefined) throw new Error("usePocketbase must be used within a PocketBaseProvider");
  return context;
};