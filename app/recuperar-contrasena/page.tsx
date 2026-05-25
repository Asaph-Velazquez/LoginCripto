import Link from "next/link";

export default function PasswordRecoveryPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "var(--page-glow)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(4,24,49,.16), rgba(7,89,201,.14), rgba(55,213,255,.06))",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "7%",
          left: "-8%",
          width: "34rem",
          height: "20rem",
          borderRadius: "48% 52% 44% 56%",
          background:
            "radial-gradient(ellipse at 36% 42%, rgba(55,213,255,.9), rgba(7,89,201,.38) 48%, rgba(7,17,31,0) 76%)",
          filter: "blur(20px)",
          opacity: 0.6,
        }}
      />

      <div
        style={{
          position: "absolute",
          right: "-10%",
          bottom: "4%",
          width: "32rem",
          height: "26rem",
          borderRadius: "52% 48% 58% 42%",
          background:
            "radial-gradient(ellipse at 52% 48%, rgba(158,208,255,.82), rgba(0,141,180,.34) 50%, rgba(7,17,31,0) 78%)",
          filter: "blur(24px)",
          opacity: 0.5,
        }}
      />

      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          width: "100%",
          display: "grid",
          alignItems: "center",
          padding: "32px 20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1120px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "28px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "18px",
              paddingRight: "8px",
            }}
          >
            <span
              style={{
                width: "fit-content",
                padding: "10px 16px",
                borderRadius: "999px",
                border: "1px solid rgba(158,208,255,.18)",
                background: "rgba(8, 23, 40, 0.48)",
                color: "var(--accent)",
                fontSize: "0.82rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Recuperacion segura
            </span>

            <div style={{ display: "grid", gap: "12px" }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(2.8rem, 6vw, 5.4rem)",
                  lineHeight: 0.94,
                  letterSpacing: "-0.05em",
                  maxWidth: "10ch",
                }}
              >
                Recupera el acceso a tu cuenta.
              </h1>
              <p
                style={{
                  margin: 0,
                  maxWidth: "34rem",
                  color: "var(--muted)",
                  fontSize: "1.02rem",
                  lineHeight: 1.7,
                }}
              >
                Ingresa tu correo y te enviaremos un enlace temporal para restablecer tu
                contrasena y validar tu identidad desde un flujo protegido.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gap: "12px",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                maxWidth: "34rem",
              }}
            >
              {[
                ["01", "Verificacion cifrada"],
                ["02", "Enlace de un solo uso"],
                ["03", "Caducidad automatica"],
              ].map(([step, label]) => (
                <div
                  key={step}
                  style={{
                    padding: "16px 18px",
                    borderRadius: "22px",
                    border: "1px solid rgba(158,208,255,.14)",
                    background: "rgba(10, 24, 42, 0.48)",
                    backdropFilter: "blur(18px)",
                  }}
                >
                  <div style={{ color: "var(--accent)", fontSize: "0.82rem", marginBottom: "8px" }}>
                    {step}
                  </div>
                  <div style={{ fontSize: "0.98rem", lineHeight: 1.5 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: "28px",
              background: "var(--surface)",
              backdropFilter: "blur(26px)",
              boxShadow: "var(--shadow)",
              padding: "28px",
            }}
          >
            <div style={{ display: "grid", gap: "10px", marginBottom: "24px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "18px",
                  display: "grid",
                  placeItems: "center",
                  background:
                    "linear-gradient(135deg, rgba(98,168,255,.28), rgba(55,213,255,.16))",
                  border: "1px solid rgba(158,208,255,.18)",
                  fontSize: "1.35rem",
                }}
              >
                RS
              </div>
              <h2 style={{ margin: 0, fontSize: "2rem", letterSpacing: "-0.04em" }}>
                Restablecer contrasena
              </h2>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.65 }}>
                Te enviaremos instrucciones al correo asociado a tu perfil.
              </p>
            </div>

            <form style={{ display: "grid", gap: "18px" }}>
              <label style={{ display: "grid", gap: "8px" }}>
                <span style={{ fontSize: "0.92rem", color: "var(--muted)" }}>Correo electronico</span>
                <input
                  type="email"
                  name="email"
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  style={{
                    width: "100%",
                    minHeight: "56px",
                    borderRadius: "18px",
                    border: "1px solid rgba(158,208,255,.14)",
                    background: "rgba(6, 18, 32, 0.76)",
                    color: "var(--foreground)",
                    padding: "0 18px",
                    outline: "none",
                    fontSize: "1rem",
                  }}
                />
              </label>

              <button
                type="submit"
                style={{
                  minHeight: "56px",
                  border: 0,
                  borderRadius: "18px",
                  background: "linear-gradient(135deg, var(--primary), var(--accent))",
                  color: "#03111d",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 16px 40px rgba(55, 213, 255, 0.22)",
                }}
              >
                Enviar enlace de recuperacion
              </button>
            </form>

            <div
              style={{
                marginTop: "20px",
                paddingTop: "18px",
                borderTop: "1px solid rgba(158,208,255,.1)",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: "12px",
                color: "var(--muted)",
                fontSize: "0.92rem",
              }}
            >
              <span>El enlace vence en 15 minutos.</span>
              <Link href="/" style={{ color: "var(--accent)", fontWeight: 700 }}>
                Volver al acceso
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
