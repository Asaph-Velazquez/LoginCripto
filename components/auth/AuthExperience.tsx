"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Switch,
  TextField,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  createTheme,
} from "@mui/material";
import {
  animateAuthStage,
  animateAuthTransition,
  animateGradientPanel,
  authFormFade,
  authSlideTrack,
  authStageSlot,
} from "./animations";

type AuthMode = "login" | "register";
type PaletteMode = "light" | "dark";

const cryptoFact = {
  eyebrow: "Criptografia moderna",
  title: "Curve25519 no implica claves intercambiables.",
  description:
    "Aunque X25519 y Ed25519 nacen de la misma familia, reutilizar la misma clave para cifrado y firma sigue siendo una mala idea por sus reglas de derivacion y codificacion.",
};

const authFields = {
  login: [
    { name: "email", label: "Correo", type: "email", autoComplete: "email" },
    {
      name: "password",
      label: "Contrasena",
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
      label: "Contrasena",
      type: "password",
      autoComplete: "new-password",
    },
  ],
};

export function AuthExperience() {
  const [authMode, setAuthMode] = useState<AuthMode>("register");
  const [paletteMode, setPaletteMode] = useState<PaletteMode>("dark");
  const cardSlotRef = useRef<HTMLDivElement | null>(null);
  const visualSlotRef = useRef<HTMLDivElement | null>(null);
  const didMountStageRef = useRef(false);

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
                  md: "translateX(0%)",
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
                  md: "translateX(100%)",
                },
              }}
            >
              <AuthPanel
                authMode={authMode}
                paletteMode={paletteMode}
                onAuthModeChange={setAuthMode}
                onPaletteModeChange={setPaletteMode}
              />
            </Box>
          </Box>
        </Container>
        <MainShowcase paletteMode={paletteMode} />
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
          opacity: paletteMode === "dark" ? 0.64 : 0.5,
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
          opacity: paletteMode === "dark" ? 0.58 : 0.46,
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
          opacity: paletteMode === "dark" ? 0.54 : 0.4,
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
          opacity: paletteMode === "dark" ? 0.38 : 0.42,
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
          opacity: paletteMode === "dark" ? 0.46 : 0.32,
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
          opacity: paletteMode === "dark" ? 0.48 : 0.34,
        }}
      />
    </Box>
  );
}

function AuthPanel({
  authMode,
  paletteMode,
  onAuthModeChange,
  onPaletteModeChange,
}: {
  authMode: AuthMode;
  paletteMode: PaletteMode;
  onAuthModeChange: (mode: AuthMode) => void;
  onPaletteModeChange: (mode: PaletteMode) => void;
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
            justifyContent: "space-between",
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

          <Tooltip title={paletteMode === "dark" ? "Tema claro" : "Tema oscuro"}>
            <IconButton
              aria-label="Cambiar tema"
              onClick={() => onPaletteModeChange(paletteMode === "dark" ? "light" : "dark")}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                width: 44,
                height: 44,
              }}
            >
              {paletteMode === "dark" ? "CL" : "OS"}
            </IconButton>
          </Tooltip>
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
              <AuthForm ref={loginFormRef} authMode="login" active={authMode === "login"} />
            </Box>
            <Box sx={{ width: "50%", pl: { xs: 1, sm: 1.5 } }}>
              <AuthForm ref={registerFormRef} authMode="register" active={authMode === "register"} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

function MainShowcase({ paletteMode }: { paletteMode: PaletteMode }) {
  return (
    <Container
      maxWidth="lg"
      sx={{
        position: "relative",
        zIndex: 1,
        py: { xs: 6, md: 10 },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.1fr .9fr" },
          gap: { xs: 3, md: 4 },
          alignItems: "stretch",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: paletteMode === "dark" ? "rgba(158,208,255,.16)" : "rgba(7,89,201,.12)",
            bgcolor: paletteMode === "dark" ? "rgba(13, 28, 46, .72)" : "rgba(255,255,255,.84)",
            backdropFilter: "blur(20px)",
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: paletteMode === "dark" ? "#9ed0ff" : "#0759c9",
            }}
          >
            {cryptoFact.eyebrow}
          </Typography>
          <Typography variant="h3" sx={{ mt: 1.5, fontSize: { xs: 28, md: 38 }, lineHeight: 1.05 }}>
            {cryptoFact.title}
          </Typography>
          <Typography sx={{ mt: 2, color: "text.secondary", lineHeight: 1.75, maxWidth: 680 }}>
            {cryptoFact.description}
          </Typography>
          <Box
            sx={{
              mt: 3,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 1.5,
            }}
          >
            {[
              "X25519 se usa para intercambio de claves.",
              "Ed25519 se usa para firmas digitales.",
              "La curva base es parecida, el uso correcto no lo es.",
              "Separar claves reduce errores operativos reales.",
            ].map((item) => (
              <Box
                key={item}
                sx={{
                  px: 1.5,
                  py: 1.25,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor:
                    paletteMode === "dark" ? "rgba(255,255,255,.08)" : "rgba(7,89,201,.08)",
                  bgcolor: paletteMode === "dark" ? "rgba(255,255,255,.03)" : "rgba(7,89,201,.03)",
                }}
              >
                <Typography sx={{ fontSize: 14 }}>{item}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: paletteMode === "dark" ? "rgba(158,208,255,.16)" : "rgba(7,89,201,.12)",
            bgcolor: paletteMode === "dark" ? "rgba(13, 28, 46, .72)" : "rgba(255,255,255,.84)",
            backdropFilter: "blur(20px)",
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: paletteMode === "dark" ? "#9ed0ff" : "#0759c9",
            }}
          >
            Foto grupal
          </Typography>
          <Box
            sx={{
              mt: 1.5,
              minHeight: { xs: 240, md: 420 },
              borderRadius: 3,
              border: "1px dashed",
              borderColor: paletteMode === "dark" ? "rgba(158,208,255,.38)" : "rgba(7,89,201,.24)",
              background:
                paletteMode === "dark"
                  ? "linear-gradient(160deg, rgba(98,168,255,.12), rgba(7,17,31,.12)), repeating-linear-gradient(135deg, rgba(255,255,255,.02), rgba(255,255,255,.02) 14px, rgba(255,255,255,.06) 14px, rgba(255,255,255,.06) 28px)"
                  : "linear-gradient(160deg, rgba(7,89,201,.08), rgba(255,255,255,.24)), repeating-linear-gradient(135deg, rgba(7,89,201,.03), rgba(7,89,201,.03) 14px, rgba(255,255,255,.3) 14px, rgba(255,255,255,.3) 28px)",
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              px: 3,
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 34 }, fontWeight: 780 }}>
                Espacio para foto grupal
              </Typography>
              <Typography sx={{ mt: 1.5, color: "text.secondary", maxWidth: 340 }}>
                Esta area queda lista para colocar la imagen principal del equipo justo despues del bloque de login.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

function AuthForm({
  authMode,
  active,
  ref,
}: {
  authMode: AuthMode;
  active: boolean;
  ref: React.Ref<HTMLDivElement>;
}) {
  const fields = authFields[authMode];
  const isLogin = authMode === "login";

  return (
    <Box
      ref={ref}
      component="form"
      noValidate
      autoComplete="on"
      aria-hidden={!active}
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
              Olvide mi contrasena
            </Button>
          </Box>
        )}

        <Button type="submit" variant="contained" size="large">
          {isLogin ? "Entrar" : "Registrarme"}
        </Button>

        <Typography sx={{ color: "text.secondary", fontSize: 13, textAlign: "center" }}>
          Al continuar aceptas la verificacion de seguridad de la plataforma.
        </Typography>
      </Box>
    </Box>
  );
}
