import rateLimit from "express-rate-limit";

const json = (message: string) => ({ message });

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: json("Too many login attempts. Try again in 15 minutes.")
});

export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: json("Too many submissions. Please try again later.")
});

export const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: json("Too many messages. Please wait a few minutes.")
});
