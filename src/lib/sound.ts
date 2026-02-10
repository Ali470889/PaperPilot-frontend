type SoundType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "loading"
  | "default";

const soundFiles: Record<SoundType, string> = {
  success: "/sounds/success.mp3",
  error: "/sounds/error.mp3",
  warning: "/sounds/warning.mp3",
  info: "/sounds/info.mp3",
  loading: "/sounds/loading.mp3",
  default: "/sounds/default.mp3",
};

const playSound = (type: SoundType) => {
  const audio = new Audio(soundFiles[type]);
  audio.currentTime = 0;
  audio.play().catch(() => {
    // Prevents crash if browser blocks autoplay
  });
};

export const sound = {
  success: () => playSound("success"),
  error: () => playSound("error"),
  warning: () => playSound("warning"),
  info: () => playSound("info"),
  loading: () => playSound("loading"),
  default: () => playSound("default"),
};
