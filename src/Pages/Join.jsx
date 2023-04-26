import {
  Alert,
  Avatar,
  Box,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import React, { useCallback, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import "../firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import md5 from "md5";
import { getDatabase, ref, set } from "firebase/database";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userReducer";

// 비밀번호 길이가 8자리 이하일때
const isPasswordValid = (password, confirmPassword) => {
  if (password !== confirmPassword) return false;
  else return true;
};

const isPasswordLength = (password, confirmPassword) => {
  if (password.length < 8 || confirmPassword.length < 8) return false;
  else return true;
};

function Join() {
  const dispatch = useDispatch();

  // state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const postUserData = useCallback(
    async (name, email, password) => {
      setLoading(true);
      try {
        const { user } = await createUserWithEmailAndPassword(
          getAuth(),
          email,
          password
        );
        await updateProfile(user, {
          displayName: name,
          photoURL: `https://www.gravatar.com/avatar/${md5(email)}?d=mp`,
        });
        await set(ref(getDatabase(), "users/" + user.uid), {
          name: user.displayName,
          avatar: user.photoURL,
        });
        // store에 user정보 저장
        dispatch(setUser(user));
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    },
    [dispatch]
  );

  // submit
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const name = data.get("name");
      const email = data.get("email");
      const password = data.get("password");
      const confirmPassword = data.get("confirmPassword");

      // 아이디 패스워드 생성규칙
      if (!name || !email || !password || !confirmPassword) {
        setError("모든 항목을 입력하세요.");
        return;
      }
      if (!isPasswordLength(password, confirmPassword)) {
        setError("비밀번호 8자리 이상 입력하세요.");
      } else if (!isPasswordValid(password, confirmPassword)) {
        setError("비밀번호를 확인하세요.");
      }
      postUserData(name, email, password);
    },
    [postUserData]
  );

  useEffect(() => {
    if (!error) return;
    // error메세지 3초뒤 제거
    setTimeout(() => {
      setError("");
    }, 3000);
  }, [error]);
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <TagIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          회원가입
        </Typography>
        <Box
          component={"form"}
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                required
                fullWidth
                label="닉네임"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                required
                fullWidth
                label="이메일 주소"
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                required
                fullWidth
                label="비밀번호"
                type="password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                required
                fullWidth
                label="확인 비밀번호"
                type="password"
              />
            </Grid>
          </Grid>
          {/* 위의 데이터가 잘못 입력됐을 경우 */}
          {error ? (
            <Alert sx={{ mt: 3 }} severity="error">
              {error}
            </Alert>
          ) : null}
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3, mb: 2 }}
            loading={loading}
          >
            회원가입
          </LoadingButton>
          <Grid container justifyContent={"flex-end"}>
            <Grid item>
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "blue",
                }}
              >
                이미 계정이 있나요? 로그인으로 이동
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Join;
