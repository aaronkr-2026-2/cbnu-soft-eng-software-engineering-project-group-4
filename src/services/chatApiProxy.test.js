import { describe, it } from "node:test";
import assert from "node:assert/strict";

import handler, {
  ALLOWED_MODEL,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
  validateChatPayload,
  checkRateLimit,
  getClientIp
} from "../../api/chat.js";

import { requestAIChat } from "./aiChatService.js";

describe("Phase 7.1: Server-Side AI Proxy — Payload & Schema Validation", () => {
  it("enforces allowed model to openai/gpt-oss-120b", () => {
    assert.equal(ALLOWED_MODEL, "openai/gpt-oss-120b");
  });

  it("approves valid dialogue payload with sanitized defaults", () => {
    const payload = {
      messages: [
        { role: "system", content: "You are a cafe barista." },
        { role: "user", content: "Can I get an iced latte?" }
      ]
    };

    const result = validateChatPayload(payload);
    assert.equal(result.isValid, true);
    assert.equal(result.sanitized.model, "openai/gpt-oss-120b");
    assert.equal(result.sanitized.temperature, 0.5);
    assert.equal(result.sanitized.max_tokens, 250);
    assert.equal(result.sanitized.messages.length, 2);
    assert.equal(result.sanitized.messages[1].content, "Can I get an iced latte?");
  });

  it("respects custom temperature and max_tokens within allowed bounds", () => {
    const payload = {
      messages: [{ role: "user", content: "Hi" }],
      temperature: 0.2,
      max_tokens: 600
    };

    const result = validateChatPayload(payload);
    assert.equal(result.isValid, true);
    assert.equal(result.sanitized.temperature, 0.2);
    assert.equal(result.sanitized.max_tokens, 600);
  });

  it("rejects non-object or null request bodies", () => {
    assert.equal(validateChatPayload(null).isValid, false);
    assert.equal(validateChatPayload(undefined).isValid, false);
    assert.equal(validateChatPayload("string").isValid, false);
    assert.equal(validateChatPayload([]).isValid, false);
  });

  it("rejects missing, non-array, or empty messages", () => {
    assert.equal(validateChatPayload({}).isValid, false);
    assert.equal(validateChatPayload({ messages: [] }).isValid, false);
    assert.equal(validateChatPayload({ messages: "hello" }).isValid, false);
  });

  it("rejects excessive message history (> 25 messages)", () => {
    const oversized = Array.from({ length: 26 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `Message ${i}`
    }));

    const result = validateChatPayload({ messages: oversized });
    assert.equal(result.isValid, false);
    assert.match(result.error, /maximum allowed message history/i);
  });

  it("rejects unauthorized message roles", () => {
    const payload = {
      messages: [{ role: "admin", content: "Authorize root access" }]
    };

    const result = validateChatPayload(payload);
    assert.equal(result.isValid, false);
    assert.match(result.error, /invalid role/i);
  });

  it("rejects empty or whitespace-only message content", () => {
    const payload = {
      messages: [{ role: "user", content: "    \t\n   " }]
    };

    const result = validateChatPayload(payload);
    assert.equal(result.isValid, false);
    assert.match(result.error, /cannot be empty/i);
  });

  it("rejects system prompts exceeding 8000 characters", () => {
    const payload = {
      messages: [{ role: "system", content: "S".repeat(8001) }]
    };

    const result = validateChatPayload(payload);
    assert.equal(result.isValid, false);
    assert.match(result.error, /System prompt exceeds maximum length/i);
  });

  it("rejects user/assistant messages exceeding 1500 characters", () => {
    const payload = {
      messages: [{ role: "user", content: "U".repeat(1501) }]
    };

    const result = validateChatPayload(payload);
    assert.equal(result.isValid, false);
    assert.match(result.error, /exceeds maximum length of 1500/i);
  });

  it("rejects invalid temperature values", () => {
    assert.equal(validateChatPayload({ messages: [{ role: "user", content: "a" }], temperature: -0.1 }).isValid, false);
    assert.equal(validateChatPayload({ messages: [{ role: "user", content: "a" }], temperature: 1.5 }).isValid, false);
    assert.equal(validateChatPayload({ messages: [{ role: "user", content: "a" }], temperature: NaN }).isValid, false);
    assert.equal(validateChatPayload({ messages: [{ role: "user", content: "a" }], temperature: "hot" }).isValid, false);
  });

  it("rejects invalid max_tokens values", () => {
    assert.equal(validateChatPayload({ messages: [{ role: "user", content: "a" }], max_tokens: 0 }).isValid, false);
    assert.equal(validateChatPayload({ messages: [{ role: "user", content: "a" }], max_tokens: 1001 }).isValid, false);
    assert.equal(validateChatPayload({ messages: [{ role: "user", content: "a" }], max_tokens: 15.5 }).isValid, false);
    assert.equal(validateChatPayload({ messages: [{ role: "user", content: "a" }], max_tokens: "high" }).isValid, false);
  });
});

describe("Phase 7.1: Server-Side AI Proxy — Rate Limiting", () => {
  it("enforces default window of 60 seconds and 30 max requests", () => {
    assert.equal(RATE_LIMIT_WINDOW_MS, 60000);
    assert.equal(RATE_LIMIT_MAX_REQUESTS, 30);
  });

  it("allows initial requests and decrements remaining counter", () => {
    const ip = `test-ip-${Date.now()}-1`;
    const now = 1000000;

    const res1 = checkRateLimit(ip, now, { maxRequests: 3 });
    assert.equal(res1.allowed, true);
    assert.equal(res1.remaining, 2);

    const res2 = checkRateLimit(ip, now + 100, { maxRequests: 3 });
    assert.equal(res2.allowed, true);
    assert.equal(res2.remaining, 1);

    const res3 = checkRateLimit(ip, now + 200, { maxRequests: 3 });
    assert.equal(res3.allowed, true);
    assert.equal(res3.remaining, 0);

    const res4 = checkRateLimit(ip, now + 300, { maxRequests: 3 });
    assert.equal(res4.allowed, false);
    assert.equal(res4.remaining, 0);
  });

  it("resets rate limit window when time expires", () => {
    const ip = `test-ip-${Date.now()}-2`;
    const now = 2000000;
    const windowMs = 5000;

    checkRateLimit(ip, now, { windowMs, maxRequests: 1 });
    const blocked = checkRateLimit(ip, now + 1000, { windowMs, maxRequests: 1 });
    assert.equal(blocked.allowed, false);

    // After window expires
    const allowedAfterExpiry = checkRateLimit(ip, now + 6000, { windowMs, maxRequests: 1 });
    assert.equal(allowedAfterExpiry.allowed, true);
  });

  it("isolates client IPs independently", () => {
    const ipA = `test-client-A-${Date.now()}`;
    const ipB = `test-client-B-${Date.now()}`;
    const now = 3000000;

    checkRateLimit(ipA, now, { maxRequests: 1 });
    const blockedA = checkRateLimit(ipA, now + 100, { maxRequests: 1 });
    assert.equal(blockedA.allowed, false);

    const allowedB = checkRateLimit(ipB, now + 100, { maxRequests: 1 });
    assert.equal(allowedB.allowed, true);
  });
});

describe("Phase 7.1: Client IP Resolution", () => {
  it("extracts client IP from x-forwarded-for header", () => {
    const req = {
      headers: { "x-forwarded-for": "203.0.113.195, 70.41.3.18" }
    };
    assert.equal(getClientIp(req), "203.0.113.195");
  });

  it("extracts client IP from x-real-ip header", () => {
    const req = {
      headers: { "x-real-ip": "198.51.100.42" }
    };
    assert.equal(getClientIp(req), "198.51.100.42");
  });

  it("falls back to socket or default local IP", () => {
    assert.equal(getClientIp({ socket: { remoteAddress: "10.0.0.5" } }), "10.0.0.5");
    assert.equal(getClientIp({}), "127.0.0.1");
  });
});

describe("Phase 7.1: Serverless Handler Execution & Security Safeguards", () => {
  function createMockResponse() {
    return {
      statusCode: null,
      headers: {},
      body: null,
      setHeader(key, val) {
        this.headers[key] = val;
        return this;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.body = data;
        return this;
      },
      end(data) {
        if (typeof data === "string") {
          try {
            this.body = JSON.parse(data);
          } catch {
            this.body = data;
          }
        }
      }
    };
  }

  it("rejects non-POST HTTP methods with status 405 and Allow header", async () => {
    const mockRes = createMockResponse();
    const mockReq = {
      method: "GET",
      headers: {}
    };

    await handler(mockReq, mockRes);
    assert.equal(mockRes.statusCode, 405);
    assert.equal(mockRes.headers["Allow"], "POST");
    assert.match(mockRes.body.error.message, /method 'GET' not allowed/i);
  });

  it("rejects malformed JSON payload with status 400", async () => {
    const mockRes = createMockResponse();
    const mockReq = {
      method: "POST",
      headers: {},
      body: "not a json string"
    };

    await handler(mockReq, mockRes);
    assert.equal(mockRes.statusCode, 400);
    assert.ok(mockRes.body.error);
  });

  it("rejects invalid message schema with status 400", async () => {
    const mockRes = createMockResponse();
    const mockReq = {
      method: "POST",
      headers: {},
      body: { messages: [] }
    };

    await handler(mockReq, mockRes);
    assert.equal(mockRes.statusCode, 400);
    assert.match(mockRes.body.error.message, /non-empty 'messages' array/i);
  });

  it("returns 500 when GROQ_API_KEY is not configured on server without leaking details", async () => {
    const originalKey = process.env.GROQ_API_KEY;
    delete process.env.GROQ_API_KEY;

    try {
      const mockRes = createMockResponse();
      const mockReq = {
        method: "POST",
        headers: { "x-forwarded-for": "1.2.3.4" },
        body: {
          messages: [{ role: "user", content: "Hello" }]
        }
      };

      await handler(mockReq, mockRes);
      assert.equal(mockRes.statusCode, 500);
      assert.equal(mockRes.body.error.message, "AI service configuration is unavailable on the server.");
      // Ensure no internal variable names or keys are exposed
      assert.ok(!JSON.stringify(mockRes.body).includes("GROQ_API_KEY"));
      assert.ok(!JSON.stringify(mockRes.body).includes("gsk_"));
    } finally {
      if (originalKey) {
        process.env.GROQ_API_KEY = originalKey;
      }
    }
  });

  it("sets required security response headers on all responses", async () => {
    const mockRes = createMockResponse();
    const mockReq = {
      method: "POST",
      headers: {},
      body: {}
    };

    await handler(mockReq, mockRes);
    assert.equal(mockRes.headers["X-Content-Type-Options"], "nosniff");
    assert.equal(mockRes.headers["Cache-Control"], "no-store, max-age=0");
    assert.ok(mockRes.headers["X-RateLimit-Limit"]);
    assert.ok(mockRes.headers["X-RateLimit-Remaining"]);
  });
});

describe("Phase 7.1: Client Service aiChatService", () => {
  it("rejects empty messages array upfront without dispatching fetch", async () => {
    await assert.rejects(
      async () => {
        await requestAIChat({ messages: [] });
      },
      /messages array is empty/i
    );
  });

  it("successfully dispatches to /api/chat and returns message content", async () => {
    const originalFetch = globalThis.fetch;
    try {
      let capturedUrl = null;
      let capturedOptions = null;

      globalThis.fetch = async (url, options) => {
        capturedUrl = url;
        capturedOptions = options;
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          json: async () => ({
            choices: [
              {
                message: {
                  content: "Welcome to the language cafe! What can I get for you today?"
                }
              }
            ]
          })
        };
      };

      const result = await requestAIChat({
        messages: [
          { role: "system", content: "Barista system prompt" },
          { role: "user", content: "Hello" }
        ],
        temperature: 0.5,
        max_tokens: 180
      });

      assert.equal(capturedUrl, "/api/chat");
      assert.equal(capturedOptions.method, "POST");
      assert.equal(capturedOptions.headers["Content-Type"], "application/json");

      const parsedBody = JSON.parse(capturedOptions.body);
      assert.equal(parsedBody.temperature, 0.5);
      assert.equal(parsedBody.max_tokens, 180);
      assert.equal(parsedBody.messages.length, 2);

      assert.equal(result, "Welcome to the language cafe! What can I get for you today?");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("handles upstream error responses cleanly with detailed message", async () => {
    const originalFetch = globalThis.fetch;
    try {
      globalThis.fetch = async () => ({
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
        json: async () => ({
          error: {
            message: "Too many AI dialogue requests."
          }
        })
      });

      await assert.rejects(
        async () => {
          await requestAIChat({
            messages: [{ role: "user", content: "Hi" }]
          });
        },
        /API error: Too many AI dialogue requests/i
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

