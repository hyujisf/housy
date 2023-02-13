const { createContext, useReducer } = require("react");

export const AppContext = createContext()

const initialState = {
  isLogin: false,
  user: {},
};

const reducer = (state, action) => {
  const { type, payload, status, isUser } = action;

  switch (type) {
    case 'SIGNIN':
      localStorage.setItem("token", payload.token);
      return {
        isLogin: true,
        user: payload
      };
    case `LOGOUT`:
      localStorage.removeItem("token");
      return {
        isLogin: false,
        user: {},
      }
      case `SEARCH`:
        return {
          isLogin: status,
          user: isUser,
          city: payload
        };
    case `FILTER`:
        return {
          isLogin: status,
          user: isUser,
          filter: payload
        };  
    
    default: {
      throw new Error();
    }
  }

}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  )
}