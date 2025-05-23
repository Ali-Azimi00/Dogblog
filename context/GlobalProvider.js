import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, getRefreshedUser } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);


const GlobalProvider = ({ children }) => {

    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = () => {
        setLoading(true);
        getRefreshedUser()
            .then((res) => {
                if (res) {
                    setUser(res);
                } else {
                    setUser(null);
                }
            })
            .catch((error) => {
                console.error("Error refreshing user:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getCurrentUser()
            .then((res) => {
                if (res) {
                    setLoading(true);
                    setUser(res);
                }
                else {
                    setLoading(false);
                    setUser(null);
                }
            })
            .catch((error) => {
                throw new Error(error)
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);


    return (
        <GlobalContext.Provider
            value={{
                isLogged,
                setIsLogged,
                user,
                setUser,
                loading,
                refreshUser,
            }
            }
        >
            {children}
        </GlobalContext.Provider>
    );
}

export default GlobalProvider;