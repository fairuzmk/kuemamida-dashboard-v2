import { createContext, useContext } from "react";

export const UrlContext = createContext<string | undefined>(undefined);

export const useUrl = () => {
  const context = useContext(UrlContext);
  if (!context) {
    throw new Error("useUrl must be used within a UrlProvider");
  }
  return context;
};