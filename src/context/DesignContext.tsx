import { createContext, useContext } from "react";
import type { DesignSystem } from "../lib/content-types";

type DesignContextValue = {
  design: DesignSystem | null;
};

export const DesignContext = createContext<DesignContextValue>({
  design: null,
});

export const useDesign = () => useContext(DesignContext);
