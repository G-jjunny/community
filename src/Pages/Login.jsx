import React, { useCallback, useEffect, useState } from "react";
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
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import "../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  // state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = useCallback(async (email, password) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, []);

  // handle
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const email = data.get("email");
      const password = data.get("password");

      if (!email || !password) {
        setError("모든 항목을 입력해주세요");
        return;
      }
      loginUser(email, password);
    },
    [loginUser]
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
          로그인
        </Typography>
        <Box
          component={"form"}
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="이메일 주소"
            name="email"
            autoComplete="off"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="비밀번호"
            name="password"
            type="password"
          />
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
            로그인
          </LoadingButton>
          <Grid container justifyContent={"flex-end"}>
            <Grid item>
              <Link
                to="/join"
                style={{ textDecoration: "none", color: "blue" }}
              >
                회원가입
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
