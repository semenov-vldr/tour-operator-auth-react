import { Alert, Box, Button, Container, Link, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { createUser } from "../firebase";
import { startSession } from "../session";

import Header  from "../assets/components/Header/Header";


export default function Register() {
  const ADMIN_EMAIL = "admin@mail.ru";

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    // validate the inputs
    if (!email || !password || !repeatPassword) {
      setError("Please fill out all the fields.");
      return;
    }
    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }
    // clear the errors
    setError("");

    try {
      let registerResponse = await createUser(email, password);
      const user = registerResponse.user;
      startSession(user);

      if (email === ADMIN_EMAIL) {
        navigate("/admin");
      } else {
        navigate("/user-form");
      }
    }
    catch (error) {
      console.error("Ошибка регистрации:", error.message);
      setError(error.message);
    }
  }

  return (
    <>
    <Header />
    <Container maxWidth="xs" sx={{mt: 15}}>
      <Typography variant="h5" component="h1" gutterBottom textAlign="center">
        Зарегистрироваться
      </Typography>
      {error && <Alert severity="error" sx={{my: 2}}>{error}</Alert>}
      <Box component="form" onSubmit={onSubmit}>
        <TextField
          label="Почта"
          variant="outlined"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{mt: 1}}
          fullWidth
          required={true}
        />
        <TextField
          label="Пароль"
          variant="outlined"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{mt: 3}}
          fullWidth
          required={true}
        />
        <TextField
          label="Повторите пароль"
          variant="outlined"
          type="password"
          autoComplete="repeat-new-password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          sx={{mt: 3}}
          fullWidth
          required={true}
        />

        <Button variant="contained" type="submit" sx={{mt: 3}} fullWidth>Зарегистрироваться</Button>
        <Box sx={{mt: 2}}>
          Уже есть аккаунт? <Link href="/login">Войти</Link>
        </Box>
      </Box>
    </Container>
    </>
  )
}