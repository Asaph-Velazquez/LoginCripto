"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  InputAdornment,
  Paper,
  Switch,
  TextField,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import {
  animateAuthStage,
  animateAuthTransition,
  animateGradientPanel,
  authFormFade,
  authSlideTrack,
  authStageSlot,
  getGradientInitialState,
} from "./animations";

type AuthMode = "login" | "register";
type PaletteMode = "light" | "dark";
type LoginValues = {
  email: string;
  password: string;
};
type RegisterValues = {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};
type SubmitState = {
  isSubmitting: boolean;
  error: string | null;
};

const authFields = {
  login: [
    { name: "email", label: "Correo", type: "email", autoComplete: "email" },
    {
      name: "password",
      label: "Contraseña",
      type: "password",
      autoComplete: "current-password",
    },
  ],
  register: [
    { name: "name", label: "Nombre", type: "text", autoComplete: "given-name" },
    {
      name: "lastName",
      label: "Primer apellido",
      type: "text",
      autoComplete: "family-name",
    },
    { name: "email", label: "Correo", type: "email", autoComplete: "email" },
    { name: "phone", label: "Numero de celular", type: "tel", autoComplete: "tel" },
    {
      name: "password",
      label: "Contraseña",
      type: "password",
      autoComplete: "new-password",
    },
  ],
};

const initialLoginValues: LoginValues = {
  email: "",
  password: "",
};

const initialRegisterValues: RegisterValues = {
  name: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
};

export function AuthExperience() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loginValues, setLoginValues] = useState<LoginValues>(initialLoginValues);
  const [registerValues, setRegisterValues] = useState<RegisterValues>(initialRegisterValues);
  const [loginState, setLoginState] = useState<SubmitState>({
    isSubmitting: false,
    error: null,
  });
  const [registerState, setRegisterState] = useState<SubmitState>({
    isSubmitting: false,
    error: null,
  });
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const cardSlotRef = useRef<HTMLDivElement | null>(null);
  const visualSlotRef = useRef<HTMLDivElement | null>(null);
  const didMountStageRef = useRef(false);
  const router = useRouter();
  const paletteMode: PaletteMode = prefersDarkMode ? "dark" : "light";

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: paletteMode,
          primary: {
            main: paletteMode === "dark" ? "#62a8ff" : "#0759c9",
            light: "#9ed0ff",
            dark: "#063b8f",
          },
          secondary: {
            main: paletteMode === "dark" ? "#37d5ff" : "#008db4",
          },
          background: {
            default: paletteMode === "dark" ? "#07111f" : "#eef6ff",
            paper: paletteMode === "dark" ? "#0d1c2e" : "#ffffff",
          },
          text: {
            primary: paletteMode === "dark" ? "#eef7ff" : "#0a1c33",
            secondary: paletteMode === "dark" ? "#9fb7d0" : "#4f6884",
          },
        },
        shape: {
          borderRadius: 8,
        },
        typography: {
          fontFamily: "var(--font-geist-sans), sans-serif",
          h1: {
            fontWeight: 760,
            letterSpacing: 0,
          },
          h2: {
            fontWeight: 720,
            letterSpacing: 0,
          },
          button: {
            fontWeight: 700,
            textTransform: "none",
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                minHeight: 48,
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              variant: "outlined",
              fullWidth: true,
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    [paletteMode],
  );

  useEffect(() => {
    if (!didMountStageRef.current) {
      didMountStageRef.current = true;
      return;
    }

    animateAuthStage({
      mode: authMode,
      cardSlot: cardSlotRef.current,
      visualSlot: visualSlotRef.current,
      visualItems: Array.from(visualSlotRef.current?.querySelectorAll("[data-visual-item]") ?? []),
    });
  }, [authMode]);

  async function submitAuthForm(mode: AuthMode) {
    const isLogin = mode === "login";
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin ? loginValues : registerValues;
    const setState = isLogin ? setLoginState : setRegisterState;

    setState({
      isSubmitting: true,
      error: null,
    });

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setState({
          isSubmitting: false,
          error: result?.error ?? "No se pudo completar la solicitud.",
        });
        return;
      }

      setState({
        isSubmitting: false,
        error: null,
      });

      if (!isLogin) {
        setLoginValues({
          email: registerValues.email,
          password: "",
        });
        setRegisterValues(initialRegisterValues);
      }

      startTransition(() => {
        router.push("/inicio");
        router.refresh();
      });
    } catch {
      setState({
        isSubmitting: false,
        error: "No se pudo conectar con el servidor.",
      });
    }
  }

  function updateLoginValue(field: keyof LoginValues, value: string) {
    setLoginValues((current) => ({
      ...current,
      [field]: value,
    }));
    setLoginState((current) => ({
      ...current,
      error: null,
    }));
  }

  function updateRegisterValue(field: keyof RegisterValues, value: string) {
    setRegisterValues((current) => ({
      ...current,
      [field]: value,
    }));
    setRegisterState((current) => ({
      ...current,
      error: null,
    }));
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          overflow: "hidden",
          bgcolor: "background.default",
          color: "text.primary",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              paletteMode === "dark"
                ? "radial-gradient(circle at 18% 18%, rgba(55, 213, 255, .18), transparent 30%), radial-gradient(circle at 82% 12%, rgba(98, 168, 255, .2), transparent 28%), linear-gradient(135deg, rgba(7,17,31,.98), rgba(8,32,58,.96))"
                : "radial-gradient(circle at 18% 18%, rgba(7, 89, 201, .14), transparent 30%), radial-gradient(circle at 82% 12%, rgba(55, 213, 255, .18), transparent 28%), linear-gradient(135deg, #f7fbff, #e6f3ff)",
          },
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            minHeight: "100vh",
            position: "relative",
            display: "grid",
            alignItems: "center",
            py: { xs: 3, md: 0 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              minHeight: { xs: "auto", md: "100vh" },
              position: "relative",
              display: { xs: "flex", md: "block" },
              flexDirection: authMode === "login" ? "column" : "column-reverse",
              gap: { xs: 3, md: 0 },
            }}
          >
            <Box
              ref={visualSlotRef}
              sx={{
                ...authStageSlot("visual"),
                transform: {
                  xs: "none",
                  md: "translateX(100%)",
                },
              }}
            >
              <VisualPanel authMode={authMode} paletteMode={paletteMode} />
            </Box>

            <Box
              ref={cardSlotRef}
              sx={{
                ...authStageSlot("card"),
                transform: {
                  xs: "none",
                  md: "translateX(0%)",
                },
              }}
            >
              <AuthPanel
                authMode={authMode}
                paletteMode={paletteMode}
                onAuthModeChange={setAuthMode}
                loginValues={loginValues}
                registerValues={registerValues}
                loginState={loginState}
                registerState={registerState}
                onLoginChange={updateLoginValue}
                onRegisterChange={updateRegisterValue}
                onSubmit={submitAuthForm}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

function VisualPanel({
  authMode,
  paletteMode,
}: {
  authMode: AuthMode;
  paletteMode: PaletteMode;
}) {
  const gradientRef = useRef<HTMLDivElement | null>(null);
  const item0 = getGradientInitialState(0);
  const item1 = getGradientInitialState(1);
  const item2 = getGradientInitialState(2);
  const item3 = getGradientInitialState(3);
  const item4 = getGradientInitialState(4);
  const item5 = getGradientInitialState(5);

  useEffect(() => {
    animateGradientPanel(Array.from(gradientRef.current?.querySelectorAll("[data-visual-item]") ?? []));
  }, []);

  return (
    <Box
      ref={gradientRef}
      sx={{
        minHeight: { xs: 260, md: "100vh" },
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        borderRadius: 0,
        background:
          paletteMode === "dark"
            ? "linear-gradient(135deg, rgba(4, 24, 49, .16), rgba(7, 89, 201, .14), rgba(55, 213, 255, .06))"
            : "linear-gradient(135deg, rgba(238,246,255,.22), rgba(7,89,201,.1), rgba(55,213,255,.12))",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: { xs: 0, md: 160 },
          left: authMode === "login" ? 0 : "auto",
          right: authMode === "login" ? "auto" : 0,
          background:
            authMode === "login"
              ? paletteMode === "dark"
                ? "linear-gradient(90deg, rgba(7,17,31,.76), rgba(7,17,31,.32), rgba(7,17,31,0))"
                : "linear-gradient(90deg, rgba(238,246,255,.92), rgba(238,246,255,.42), rgba(238,246,255,0))"
              : paletteMode === "dark"
                ? "linear-gradient(270deg, rgba(7,17,31,.76), rgba(7,17,31,.32), rgba(7,17,31,0))"
                : "linear-gradient(270deg, rgba(238,246,255,.92), rgba(238,246,255,.42), rgba(238,246,255,0))",
          opacity: 0.94,
        }}
      />
      <Box
        data-visual-item
        sx={{
          position: "absolute",
          width: { xs: 340, md: 560 },
          height: { xs: 210, md: 360 },
          left: "-14%",
          top: "6%",
          borderRadius: "48% 52% 44% 56%",
          background:
            "radial-gradient(ellipse at 36% 42%, rgba(55,213,255,.9), rgba(7,89,201,.38) 48%, rgba(7,17,31,0) 76%)",
          filter: "blur(18px)",
          opacity: paletteMode === "dark" ? item0.opacity : item0.opacity * 0.78,
          transform: `translateX(${item0.translateX}) translateY(${item0.translateY}) scale(${item0.scale}) rotate(${item0.rotate})`,
        }}
      />
      <Box
        data-visual-item
        sx={{
          position: "absolute",
          width: { xs: 300, md: 520 },
          height: { xs: 260, md: 460 },
          right: "-18%",
          bottom: "2%",
          borderRadius: "52% 48% 58% 42%",
          background:
            "radial-gradient(ellipse at 52% 48%, rgba(158,208,255,.82), rgba(0,141,180,.34) 50%, rgba(7,17,31,0) 78%)",
          filter: "blur(22px)",
          opacity: paletteMode === "dark" ? item1.opacity : item1.opacity * 0.6,
          transform: `translateX(${item1.translateX}) translateY(${item1.translateY}) scale(${item1.scale}) rotate(${item1.rotate})`,
        }}
      />
      <Box
        data-visual-item
        sx={{
          position: "absolute",
          width: { xs: 240, md: 410 },
          height: { xs: 170, md: 300 },
          left: "20%",
          bottom: "18%",
          borderRadius: "42% 58% 50% 50%",
          background:
            "linear-gradient(135deg, rgba(98,168,255,.5), rgba(55,213,255,.2), rgba(7,89,201,.36))",
          filter: "blur(14px)",
          opacity: paletteMode === "dark" ? item2.opacity : item2.opacity * 0.52,
          transform: `translateX(${item2.translateX}) translateY(${item2.translateY}) scale(${item2.scale}) rotate(${item2.rotate})`,
        }}
      />
      <Box
        data-visual-item
        sx={{
          position: "absolute",
          width: { xs: 210, md: 340 },
          height: { xs: 210, md: 340 },
          left: "44%",
          top: "22%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,.34), rgba(98,168,255,.22) 42%, rgba(7,89,201,0) 74%)",
          filter: "blur(20px)",
          opacity: paletteMode === "dark" ? item3.opacity * 0.48 : item3.opacity * 0.54,
          transform: `translateX(${item3.translateX}) translateY(${item3.translateY}) scale(${item3.scale}) rotate(${item3.rotate})`,
        }}
      />
      <Box
        data-visual-item
        sx={{
          position: "absolute",
          width: { xs: 360, md: 680 },
          height: { xs: 80, md: 140 },
          left: "-8%",
          top: "46%",
          borderRadius: 999,
          background:
            "linear-gradient(90deg, rgba(55,213,255,0), rgba(55,213,255,.32), rgba(158,208,255,.28), rgba(55,213,255,0))",
          filter: "blur(16px)",
          opacity: paletteMode === "dark" ? item4.opacity * 0.54 : item4.opacity * 0.4,
          transform: `translateX(${item4.translateX}) translateY(${item4.translateY}) scale(${item4.scale}) rotate(${item4.rotate})`,
        }}
      />
      <Box
        data-visual-item
        sx={{
          position: "absolute",
          width: { xs: 180, md: 280 },
          height: { xs: 150, md: 230 },
          right: "20%",
          top: "10%",
          borderRadius: "40% 60% 46% 54%",
          background:
            "radial-gradient(ellipse at center, rgba(7,89,201,.44), rgba(55,213,255,.22) 46%, rgba(7,17,31,0) 76%)",
          filter: "blur(18px)",
          opacity: paletteMode === "dark" ? item5.opacity * 0.62 : item5.opacity * 0.44,
          transform: `translateX(${item5.translateX}) translateY(${item5.translateY}) scale(${item5.scale}) rotate(${item5.rotate})`,
        }}
      />
    </Box>
  );
}

function AuthPanel({
  authMode,
  paletteMode,
  onAuthModeChange,
  loginValues,
  registerValues,
  loginState,
  registerState,
  onLoginChange,
  onRegisterChange,
  onSubmit,
}: {
  authMode: AuthMode;
  paletteMode: PaletteMode;
  onAuthModeChange: (mode: AuthMode) => void;
  loginValues: LoginValues;
  registerValues: RegisterValues;
  loginState: SubmitState;
  registerState: SubmitState;
  onLoginChange: (field: keyof LoginValues, value: string) => void;
  onRegisterChange: (field: keyof RegisterValues, value: string) => void;
  onSubmit: (mode: AuthMode) => Promise<void>;
}) {
  const isLogin = authMode === "login";
  const trackRef = useRef<HTMLDivElement | null>(null);
  const loginFormRef = useRef<HTMLDivElement | null>(null);
  const registerFormRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    animateAuthTransition({
      mode: authMode,
      track: trackRef.current,
      loginForm: loginFormRef.current,
      registerForm: registerFormRef.current,
    });
  }, [authMode]);

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 480,
        mx: "auto",
        p: { xs: 2.5, sm: 4 },
        borderRadius: 2,
        border: "1px solid",
        borderColor: paletteMode === "dark" ? "rgba(158,208,255,.16)" : "rgba(7,89,201,.12)",
        bgcolor: paletteMode === "dark" ? "rgba(13, 28, 46, .86)" : "rgba(255,255,255,.9)",
        backdropFilter: "blur(26px)",
        boxShadow:
          paletteMode === "dark"
            ? "0 24px 80px rgba(0, 0, 0, .4)"
            : "0 24px 80px rgba(7, 89, 201, .16)",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h2" sx={{ fontSize: 28 }}>
              {isLogin ? "Iniciar sesion" : "Crear cuenta"}
            </Typography>
            <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
              {isLogin ? "Accede con tus credenciales." : "Registra tus datos principales."}
            </Typography>
          </Box>
        </Box>

        <ToggleButtonGroup
          color="primary"
          exclusive
          fullWidth
          value={authMode}
          onChange={(_, value: AuthMode | null) => value && onAuthModeChange(value)}
          aria-label="Modo de autenticacion"
          sx={{
            "& .MuiToggleButton-root": {
              minHeight: 44,
              fontWeight: 800,
              borderColor: "divider",
            },
          }}
        >
          <ToggleButton value="login">Login</ToggleButton>
          <ToggleButton value="register">Registro</ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ overflow: "hidden" }}>
          <Box
            ref={trackRef}
            sx={{
              ...authSlideTrack(),
            }}
          >
            <Box sx={{ width: "50%", pr: { xs: 1, sm: 1.5 } }}>
              <AuthForm
                ref={loginFormRef}
                authMode="login"
                active={authMode === "login"}
                values={loginValues}
                submitState={loginState}
                onChange={onLoginChange}
                onSubmit={onSubmit}
              />
            </Box>
            <Box sx={{ width: "50%", pl: { xs: 1, sm: 1.5 } }}>
              <AuthForm
                ref={registerFormRef}
                authMode="register"
                active={authMode === "register"}
                values={registerValues}
                submitState={registerState}
                onChange={onRegisterChange}
                onSubmit={onSubmit}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

type AuthFormProps =
  | {
      authMode: "login";
      active: boolean;
      values: LoginValues;
      submitState: SubmitState;
      onChange: (field: keyof LoginValues, value: string) => void;
      onSubmit: (mode: AuthMode) => Promise<void>;
      ref: React.Ref<HTMLDivElement>;
    }
  | {
      authMode: "register";
      active: boolean;
      values: RegisterValues;
      submitState: SubmitState;
      onChange: (field: keyof RegisterValues, value: string) => void;
      onSubmit: (mode: AuthMode) => Promise<void>;
      ref: React.Ref<HTMLDivElement>;
    };

function AuthForm({ authMode, active, ref, values, submitState, onChange, onSubmit }: AuthFormProps) {
  const isLogin = authMode === "login";
  const fields = authFields[authMode];

  return (
    <Box
      ref={ref}
      component="form"
      noValidate
      autoComplete="on"
      aria-hidden={!active}
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(authMode);
      }}
      sx={{
        ...authFormFade(active),
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
        {fields.map((field) => (
          <TextField
            key={field.name}
            required
            name={field.name}
            label={field.label}
            type={field.type}
            autoComplete={field.autoComplete}
            value={values[field.name as keyof typeof values] ?? ""}
            onChange={(event) =>
              onChange(field.name as keyof LoginValues & keyof RegisterValues, event.target.value)
            }
            slotProps={
              field.name === "phone"
                ? {
                    input: {
                      startAdornment: <InputAdornment position="start">+52</InputAdornment>,
                    },
                  }
                : undefined
            }
          />
        ))}

        {submitState.error ? (
          <Typography sx={{ color: "#ff8f8f", fontSize: 13 }}>{submitState.error}</Typography>
        ) : null}

        {isLogin && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <FormControlLabel control={<Switch size="small" />} label="Recordarme" />
            <Button component={Link} href="/recuperar-contrasena" variant="text" sx={{ px: 0 }}>
              Olvide mi contraseña
            </Button>
          </Box>
        )}

        <Button type="submit" variant="contained" size="large" disabled={submitState.isSubmitting}>
          {submitState.isSubmitting ? (isLogin ? "Entrando..." : "Registrando...") : isLogin ? "Entrar" : "Registrarme"}
        </Button>

        <Typography sx={{ color: "text.secondary", fontSize: 13, textAlign: "center" }}>
          Al continuar aceptas la verificacion de seguridad de la plataforma.
        </Typography>
      </Box>
    </Box>
  );
}
