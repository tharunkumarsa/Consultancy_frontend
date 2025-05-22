import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ModuleContext = React.createContext();

export const useModuleContext = () => useContext(ModuleContext);

export const ModuleProvider = ({ children }) => {
  const [modules, setModules] = useState(() => {
    const storedModules = localStorage.getItem("modules");
    return storedModules ? JSON.parse(storedModules) : [];
  });

  useEffect(() => {
    localStorage.setItem("modules", JSON.stringify(modules));
  }, [modules]);

  const addModule = (module) => {
    setModules((prev) => [...prev, module]);
    console.log("Module added:", module);
  };

  const removeModule = (module) => {
    setModules((prev) =>
      prev.filter((mod) => mod.moduleName !== module.moduleName)
    );
    console.log("Module removed:", module);
  };

  const value = {
    modules,
    setModules,
    addModule,
    removeModule,
  };

  return (
    <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>
  );
};
