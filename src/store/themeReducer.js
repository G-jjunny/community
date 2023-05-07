const SET_THEME = "SET_THEME";

export const setTheme = (mainTheme, subTheme, textTheme) => ({
  type: SET_THEME,
  mainTheme,
  subTheme,
  textTheme,
});

const initialState = {
  mainTheme: "#a5a19c",
  subTheme: "#e0dac7",
  textTheme: "#eef3ee",
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_THEME:
      return {
        mainTheme: action.mainTheme,
        subTheme: action.subTheme,
        textTheme: action.textTheme,
      };

    default:
      return state;
  }
};

export default themeReducer;
