import { animate, remove } from "animejs";

export const authSlideTrack = () => ({
  display: "flex",
  width: "200%",
  transform: "translateX(0%)",
});

export const authFormFade = (active) => ({
  opacity: active ? 1 : 0.35,
});

export const authStageSlot = (side) => ({
  position: { xs: "relative", md: "absolute" },
  top: { md: 0 },
  bottom: { md: 0 },
  left: { md: 0 },
  width: { xs: "100%", md: "50%" },
  display: "grid",
  alignItems: "center",
  px: side === "card" ? { xs: 0, md: 4 } : 0,
  pointerEvents: side === "visual" ? "none" : "auto",
  zIndex: side === "card" ? 2 : 3,
});

export function setAuthStageLayout({ mode, cardSlot, visualSlot }) {
  if (!cardSlot || !visualSlot) {
    return;
  }

  cardSlot.style.transform = mode === "login" ? "translateX(0%)" : "translateX(100%)";
  visualSlot.style.transform = mode === "login" ? "translateX(100%)" : "translateX(0%)";
}

export function animateAuthStage({ mode, cardSlot, visualSlot, visualItems }) {
  if (!cardSlot || !visualSlot) {
    return;
  }

  remove([cardSlot, visualSlot, ...visualItems]);
  visualSlot.style.zIndex = "4";

  animate(cardSlot, {
    translateX: mode === "login" ? "0%" : "100%",
    duration: 620,
    ease: "inOutCubic",
  });

  animate(visualSlot, {
    translateX: mode === "login" ? "100%" : "0%",
    duration: 620,
    ease: "inOutCubic",
    onComplete: () => {
      visualSlot.style.zIndex = "3";
    },
  });

  animate(visualItems, {
    opacity: (_, index) => (index % 2 === 0 ? [0.34, 0.88] : [0.78, 0.4]),
    scale: (_, index) => (index % 2 === 0 ? [0.72, 1.22] : [1.18, 0.82]),
    rotate: (_, index) => (index % 2 === 0 ? ["-18deg", "26deg"] : ["24deg", "-22deg"]),
    duration: 520,
    delay: (_, index) => index * 45,
    ease: "outCubic",
  });
}

export function animateGradientPanel(items) {
  if (!items.length) {
    return;
  }

  remove(items);

  animate(items, {
    translateX: (_, index) =>
      index % 2 === 0 ? ["24%", "-26%"] : ["-26%", "24%"],
    translateY: (_, index) =>
      index % 3 === 0 ? ["18%", "-20%"] : ["-16%", "19%"],
    scale: (_, index) =>
      index % 2 === 0 ? [0.78, 1.24] : [1.2, 0.82],
    rotate: (_, index) =>
      index % 2 === 0 ? ["-24deg", "32deg"] : ["34deg", "-28deg"],
    opacity: (_, index) =>
      index % 2 === 0 ? [0.36, 0.84] : [0.78, 0.32],
    duration: (_, index) => 2600 + index * 340,
    delay: (_, index) => index * 90,
    ease: "inOutSine",
    loop: true,
    alternate: true,
  });
}

export function getGradientInitialState(index) {
  return {
    translateX: index % 2 === 0 ? "24%" : "-26%",
    translateY: index % 3 === 0 ? "18%" : "-16%",
    scale: index % 2 === 0 ? 0.78 : 1.2,
    rotate: index % 2 === 0 ? "-24deg" : "34deg",
    opacity: index % 2 === 0 ? 0.36 : 0.78,
  };
}

export function animateAuthTransition({ mode, track, loginForm, registerForm }) {
  if (!track || !loginForm || !registerForm) {
    return;
  }

  remove([track, loginForm, registerForm]);

  animate(track, {
    translateX: mode === "login" ? "0%" : "-50%",
    duration: 380,
    ease: "inOutCubic",
  });

  animate(loginForm, {
    opacity: mode === "login" ? 1 : 0.35,
    duration: 220,
    ease: "outQuad",
  });

  animate(registerForm, {
    opacity: mode === "register" ? 1 : 0.35,
    duration: 220,
    ease: "outQuad",
  });
}
