import pino from "pino";
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: process.env.NODE_ENV === "development" ? { target: "pino-pretty" } : undefined,
});
export function withReqId(req){ const id = req.headers.get("x-request-id") || crypto.randomUUID(); return logger.child({ reqId: id, path: req.url }); }
