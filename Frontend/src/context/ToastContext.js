import { createContext, useContext } from "react";

export const ToastCtx = createContext(null);

export const useToast = () => useContext(ToastCtx);
