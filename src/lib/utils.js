import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const validatePhone = (num) => {
  if (!num) return "Phone number is required";
  if (!/^\d+$/.test(num)) return "Only digits allowed";
  if (!num.startsWith("923")) return "Number must start with 923";
  if (num.length !== 12) return "Number must be exactly 12 digits";
  return null;
};

export function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}


export const areArraysEqual = (arr1 = [], arr2 = []) => {
  if (arr1.length !== arr2.length) return false;

  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();

  return sorted1.every((value, index) => value === sorted2[index]);
};


const sortDeep = (value) => {
  if (Array.isArray(value)) {
    return value.map(sortDeep).sort((a, b) =>
      JSON.stringify(a).localeCompare(JSON.stringify(b))
    );
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortDeep(value[key]);
        return acc;
      }, {});
  }

  return value;
};

export const areJsonEqual = (a, b) => {
  return JSON.stringify(sortDeep(a)) === JSON.stringify(sortDeep(b));
};
