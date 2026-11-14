/**
 * api/chat.js
 * Vercel Serverless Function & AI Proxy for Groq Cloud API.
 *
 * Security Architecture:
 * - Reads GROQ_API_KEY exclusively from server-side environment variables.
 * - Keeps API secrets completely isolated from the browser and client bundles.
 * - Enforces strict schema validation, request size bounding, and token constraints.
 * - Provides sliding-window rate limiting to throttle rapid burst abuse.
 * - Sanitizes upstream error responses to prevent credential or infrastructure leakage.
 */

// Model pinned for educational dialogue and examiner evaluation
export const ALLOWED_MODEL = "openai/gpt-oss-120b";

// Rate limiting configuration (per serverless instance)
export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute per IP

// In-memory rate limiting store
// Note on Vercel Serverless Architecture:
// In-memory state persists across warm invocations of a single container instance,
// providing immediate defense against single-client request floods and burst attacks.
// For distributed rate limiting across all auto-scaled serverless instances,
// a centralized persistent store (e.g. Upstash Redis / Vercel KV) is recommended.
const rateLimitMap = new Map();

/**
 * Periodically prunes expired rate limit entries to prevent memory growth.
 */
function cleanupExpiredRateLimits(now) {
  if (rateLimitMap.size > 1000) {
    for (const [ip, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  }
}

/**
 * Validates and updates client rate limit status.
 *
 * @param {string} clientIp
 * @param {number} [now=Date.now()]
 * @param {object} [options]
 * @returns {{ allowed: boolean, remaining: number, resetTime: number }}
 */
export function checkRateLimit(clientIp, now = Date.now(), options = {}) {
  const windowMs = options.windowMs || RATE_LIMIT_WINDOW_MS;
  const maxRequests = options.maxRequests || RATE_LIMIT_MAX_REQUESTS;

  cleanupExpiredRateLimits(now);

  const entry = rateLimitMap.get(clientIp);
  if (!entry || now > entry.resetTime) {
    const newEntry = {
      count: 1,
      resetTime: now + windowMs
    };
    rateLimitMap.set(clientIp, newEntry);
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: newEntry.resetTime
    };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime
  };
}

/**
 * Validates the chat payload structure, message roles, and character length bounds.
 *
 * @param {unknown} body
 * @returns {{ isValid: boolean, error?: string, sanitized?: object }}
 */
export function validateChatPayload(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { isValid: false, error: "Invalid JSON request body: expected an object." };
  }

  const { messages, temperature, max_tokens, model } = body;

  // 1. Validate messages array
  if (!Array.isArray(messages) || messages.length === 0) {
    return { isValid: false, error: "Request body must include a non-empty 'messages' array." };
  }

  if (messages.length > 25) {
    return { isValid: false, error: "Exceeded maximum allowed message history length (max 25 messages)." };
  }

  const sanitizedMessages = [];
  const validRoles = new Set(["system", "user", "assistant"]);

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (!msg || typeof msg !== "object") {
      return { isValid: false, error: `Message at index ${i} must be an object.` };
    }

    if (!validRoles.has(msg.role)) {
      return { isValid: false, error: `Message at index ${i} has invalid role '${msg.role}'. Must be system, user, or assistant.` };
    }

    if (typeof msg.content !== "string") {
      return { isValid: false, error: `Message at index ${i} content must be a string.` };
    }

    const trimmedContent = msg.content.trim();
    if (!trimmedContent) {
      return { isValid: false, error: `Message at index ${i} content cannot be empty.` };
    }

    // Role-specific length limits
    if (msg.role === "system") {
      if (trimmedContent.length > 8000) {
        return { isValid: false, error: `System prompt exceeds maximum length of 8000 characters.` };
      }
    } else {
      if (trimmedContent.length > 1500) {
        return { isValid: false, error: `User/Assistant message at index ${i} exceeds maximum length of 1500 characters.` };
      }
    }

    sanitizedMessages.push({
      role: msg.role,
      content: trimmedContent
    });
  }

  // 2. Validate temperature
  let validTemperature = 0.5;
  if (temperature !== undefined) {
    if (typeof temperature !== "number" || isNaN(temperature) || temperature < 0.0 || temperature > 1.0) {
      return { isValid: false, error: "Temperature must be a number between 0.0 and 1.0." };
    }
    validTemperature = temperature;
  }

  // 3. Validate max_tokens
  let validMaxTokens = 250;
  if (max_tokens !== undefined) {
    if (typeof max_tokens !== "number" || !Number.isInteger(max_tokens) || max_tokens < 1 || max_tokens > 1000) {
      return { isValid: false, error: "max_tokens must be an integer between 1 and 1000." };
    }
    validMaxTokens = max_tokens;
  }

  // 4. Validate or enforce model
  const validModel = model === ALLOWED_MODEL ? ALLOWED_MODEL : ALLOWED_MODEL;

  return {
    isValid: true,
    sanitized: {
      model: validModel,
      messages: sanitizedMessages,
      temperature: validTemperature,
      max_tokens: validMaxTokens
    }
  };
}

/**
 * Extracts the client IP from request headers or socket.
 */
export function getClientIp(req) {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return (
    req.headers?.["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "127.0.0.1"
  );
}

/**
 * Helper to safely extract JSON body across Vercel serverless and Node HTTP request formats.
 */
async function parseRequestBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }
  if (typeof req.body === "string" && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch {
      throw new Error("Malformed JSON in request body.");
    }
  }

  // Handle stream if body not pre-parsed
  if (typeof req.on === "function") {
    return new Promise((resolve, reject) => {
      const chunks = [];
      let totalLength = 0;
      const MAX_PAYLOAD_BYTES = 32 * 1024; // 32 KB limit

      req.on("data", (chunk) => {
        totalLength += chunk.length;
        if (totalLength > MAX_PAYLOAD_BYTES) {
          reject(new Error("Request payload exceeds 32KB limit."));
          return;
        }
        chunks.push(chunk);
      });

      req.on("end", () => {
        if (chunks.length === 0) {
          resolve(null);
          return;
        }
        try {
          const raw = Buffer.concat(chunks).toString("utf-8");
          resolve(JSON.parse(raw));
        } catch {
          reject(new Error("Malformed JSON in request stream."));
        }
      });

      req.on("error", (err) => reject(err));
    });
  }

  return null;
}

/**
 * Standard JSON response helper supporting both Vercel res.status().json() and Node res.
 */
function sendJson(res, statusCode, data, headers = {}) {
  for (const [k, v] of Object.entries(headers)) {
    if (typeof res.setHeader === "function") {
      res.setHeader(k, v);
    }
  }

  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(statusCode).json(data);
  }

  res.statusCode = statusCode;
  if (typeof res.setHeader === "function") {
    res.setHeader("Content-Type", "application/json");
  }
  res.end(JSON.stringify(data));
}

/**
 * Primary Vercel Serverless Function Handler.
 *
 * @param {import("http").IncomingMessage & { body?: any }} req
 * @param {import("http").ServerResponse & { status?: Function, json?: Function }} res
 */
export default async function handler(req, res) {
  // 1. HTTP Method Check
  if (req.method !== "POST") {
    return sendJson(res, 405, {
      error: { message: `Method '${req.method}' not allowed. Please use POST.` }
    }, { Allow: "POST" });
  }

  // 2. Rate Limiting Check
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(clientIp);
  const rateHeaders = {
    "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
    "X-RateLimit-Remaining": String(rateLimit.remaining),
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store, max-age=0"
  };

  if (!rateLimit.allowed) {
    const retrySeconds = Math.max(1, Math.ceil((rateLimit.resetTime - Date.now()) / 1000));
    return sendJson(res, 429, {
      error: {
        message: "Too many AI dialogue requests. Please wait a moment before sending another message.",
        retryAfter: retrySeconds
      }
    }, {
      ...rateHeaders,
      "Retry-After": String(retrySeconds)
    });
  }

  // 3. Request Body Parsing & Validation
  let body;
  try {
    body = await parseRequestBody(req);
  } catch (parseErr) {
    return sendJson(res, 400, {
      error: { message: parseErr.message || "Failed to parse JSON body." }
    }, rateHeaders);
  }

  const validation = validateChatPayload(body);
  if (!validation.isValid) {
    return sendJson(res, 400, {
      error: { message: validation.error }
    }, rateHeaders);
  }

  // 4. Server-Side Secret Verification
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    // Redact internal detail: never expose API key variable names to the client
    return sendJson(res, 500, {
      error: { message: "AI service configuration is unavailable on the server." }
    }, rateHeaders);
  }

  // 5. Upstream Groq Cloud Request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const upstreamResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify(validation.sanitized)
    });

    clearTimeout(timeoutId);

    let upstreamData;
    try {
      upstreamData = await upstreamResponse.json();
    } catch {
      return sendJson(res, 502, {
        error: { message: "Invalid JSON response received from upstream AI provider." }
      }, rateHeaders);
    }

    if (!upstreamResponse.ok || upstreamData?.error) {
      // Forward sanitized error message without leaking headers or auth
      const errorMsg = upstreamData?.error?.message || `Upstream AI provider error (Status ${upstreamResponse.status}).`;
      const clientStatusCode = upstreamResponse.status === 429 ? 429 : 502;
      return sendJson(res, clientStatusCode, {
        error: { message: errorMsg }
      }, rateHeaders);
    }

    // 6. Return standard choices response
    return sendJson(res, 200, {
      choices: upstreamData.choices || []
    }, rateHeaders);

  } catch (fetchErr) {
    clearTimeout(timeoutId);

    if (fetchErr.name === "AbortError") {
      return sendJson(res, 504, {
        error: { message: "Upstream AI provider request timed out (15s)." }
      }, rateHeaders);
    }

    return sendJson(res, 502, {
      error: { message: "Unable to contact upstream AI provider." }
    }, rateHeaders);
  }
}

