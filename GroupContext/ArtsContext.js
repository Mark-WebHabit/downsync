import React, { createContext, useEffect, useState } from "react";
import { getSavedUser } from "../utilities/preferences";
import { createListener } from "../utilities/CreateListener";

export const ArtContext = createContext(null);

const ArtContextProvider = ({ children }) => {
  const [fetching, setFetching] = useState(true);
  const [user, setUser] = useState(null);
  const [colors, setColors] = useState(null);

  useEffect(() => {
    async function getUser() {
      const savedUser = await getSavedUser();
      setUser(savedUser);

      if (savedUser?.uid) {
        const unsubscribeColors = createListener(
          `arts/colors`,
          savedUser.uid,
          (data) => {
            const result = [];

            const keys = Object.keys(data);
            keys.forEach((key) => {
              const obj = {
                uid: key,
                ...data[key],
              };

              result.push(obj);
            });

            setColors(result);
          }
        );

        setFetching(false);
        // Add more listeners here as needed
        // const unsubscribeAnother = createListener('another_path', savedUser.uid, (data) => { ... });

        // Cleanup listeners when the component unmounts
        return () => {
          unsubscribeColors();
          // unsubscribeAnother();
        };
      }
    }
    getUser();
  }, []);

  return (
    <ArtContext.Provider value={{ fetching, user, colors }}>
      {children}
    </ArtContext.Provider>
  );
};

export default ArtContextProvider;