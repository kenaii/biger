import React, {createContext, useReducer} from 'react';

const initialState = {
  isLoading: true,
};
const store = createContext();

const StateProvider = ({children}) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'SET_LOADING':
        return {
          ...state,
          isLoading: action.payload,
        };
      default: {
        return {...state};
      }
    }
  }, initialState);

  return <store.Provider value={[state, dispatch]}>{children}</store.Provider>;
};

export {store, StateProvider};
