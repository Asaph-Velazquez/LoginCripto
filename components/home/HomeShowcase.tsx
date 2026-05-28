"use client";

import Link from "next/link";
import { Box, Button, Container, Paper, Typography, useMediaQuery } from "@mui/material";
import Image from "next/image";

type PaletteMode = "light" | "dark";

const cryptoFact = {
  eyebrow: "Criptografia moderna",
  title: "Curve25519 no implica claves intercambiables.",
  description:
    "Aunque X25519 y Ed25519 nacen de la misma familia, reutilizar la misma clave para cifrado y firma sigue siendo una mala idea por sus reglas de derivacion y codificacion.",
};

export function HomeShowcase() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const paletteMode: PaletteMode = prefersDarkMode ? "dark" : "light";
  const primaryText = paletteMode === "dark" ? "#ffffff" : "#0a1c33";
  const secondaryText = paletteMode === "dark" ? "rgba(255,255,255,.82)" : "#4f6884";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        bgcolor: paletteMode === "dark" ? "#07111f" : "#eef6ff",
        color: primaryText,
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
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          py: { xs: 6, md: 10 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
            mb: 4,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: paletteMode === "dark" ? "#9ed0ff" : "#0759c9" }}>
              Inicio
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, fontSize: { xs: 30, md: 44 } }}>
              Panel principal despues del acceso
            </Typography>
          </Box>
          <Button component={Link} href="/" variant="outlined" sx={{ borderRadius: 999, px: 2.5 }}>
            Volver al login
          </Button>
        </Box>

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
              color: primaryText,
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
            <Typography sx={{ mt: 2, color: secondaryText, lineHeight: 1.75, maxWidth: 680 }}>
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
                    color: primaryText,
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
              color: primaryText,
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
              Foto del equipo Criptext
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
                <Image
                  src="/foto.jpeg"
                  alt="Foto grupal"
                  width={400}
                  height={500}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
