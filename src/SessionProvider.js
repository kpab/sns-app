import { createContext, useState } from "react";

const SessionContext = createContext();

const SessionProvider = (props) => {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <SessionContext.Provider value={{ currentUser, setCurrentUser }}>
      {props.children}
    </SessionContext.Provider>
  );
};

export { SessionContext, SessionProvider };
