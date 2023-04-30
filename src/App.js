import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Join from "./Pages/Join";
import Login from "./Pages/Login";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "./store/userReducer";
import Main from "./Pages/Main";
import { CircularProgress, Stack } from "@mui/material";

function App() {
  const dispatch = useDispatch();
  const { isLoading, currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (!!user) {
        dispatch(setUser(user));
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  // 로딩시 프로그레스바 활성화
  if (isLoading) {
    return (
      <Stack alignItems={"center"} justifyContent="center" height={"100vh"}>
        <CircularProgress color="primary" size={130} />
      </Stack>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={currentUser ? <Main /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/" /> : <Login />}
        ></Route>
        <Route
          path="/join"
          // currentUser 정보가 있으면 메인페이지로 이동
          element={currentUser ? <Navigate to="/" /> : <Join />}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
