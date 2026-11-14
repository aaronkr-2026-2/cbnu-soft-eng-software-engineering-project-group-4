/**
 * aiChatService.js
 * Client-side communication service for the secure /api/chat AI proxy.
 *
 * Replaces direct client-to-Groq requests with secure, authenticated proxy calls.
 * Ensures zero API keys or secrets are exposed to the browser.
 */

/**
 * Dispatches a chat completion request to the secure backend proxy (/api/chat).
 *
 * @param {object} options
 * @param {Array<{ role: string, content: string }>} options.messages - Array of system/user/assistant messages
 * @param {number} [options.temperature=0.5] - Sampling temperature
 * @param {number} [options.max_tokens=250] - Token limit
 * @param {AbortSignal} [options.signal] - Optional abort signal for cancellation
 * @param {string} [options.endpoint="/api/chat"] - API endpoint path
 * @returns {Promise<string>} The assistant's text reply
 */
export async function requestAIChat({
  messages,
  temperature = 0.5,
  max_tokens = 250,
  signal,
  endpoint = "/api/chat"
}) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Cannot dispatch AI chat request: messages array is empty.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages,
      temperature,
      max_tokens
    })
  });

  let data;
  try {
    data = await response.json();
  } catch (jsonErr) {
    throw new Error(`JSON parsing failure: ${jsonErr.message}`);
  }

  if (!response.ok || data?.error) {
    const errorMsg = data?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
    const err = new Error(`API error: ${errorMsg}`);
    err.status = response.status;
    err.details = data?.error;
    throw err;
  }

  const rawReply = data?.choices?.[0]?.message?.content?.trim();
  if (!rawReply) {
    throw new Error("Empty response content received from AI service.");
  }

  return rawReply;
}

