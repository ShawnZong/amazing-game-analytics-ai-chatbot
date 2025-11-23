/**
 * Minimal Client Example for POST /chat endpoint
 * 
 * This demonstrates how to call the Cloudflare Worker from any client
 * (frontend, mobile app, CLI tool, etc.)
 */

/**
 * Chat request interface
 */
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatRequest {
  sessionId: string;
  messages: ChatMessage[];
}

interface ChatResponse {
  reply: string;
  tools?: Array<{
    name: string;
    result: any;
  }>;
}

interface ErrorResponse {
  code: string;
  message: string;
}

/**
 * Send a chat request to the worker
 * 
 * @param workerUrl - URL of the deployed worker
 * @param sessionId - Unique session identifier
 * @param messages - Conversation history
 * @returns Chat response from the LLM
 */
async function sendChatRequest(
  workerUrl: string,
  sessionId: string,
  messages: ChatMessage[]
): Promise<ChatResponse> {
  const request: ChatRequest = {
    sessionId,
    messages,
  };

  const response = await fetch(`${workerUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(`Chat request failed: ${error.code} - ${error.message}`);
  }

  return await response.json();
}

/**
 * Example 1: Simple single-turn conversation
 */
async function example1() {
  console.log("=== Example 1: Simple Query ===\n");

  const workerUrl = "http://localhost:8787"; // Change to your worker URL
  const sessionId = "session-" + Date.now();

  const response = await sendChatRequest(workerUrl, sessionId, [
    {
      role: "user",
      content: "What are some popular action games?",
    },
  ]);

  console.log("Assistant:", response.reply);
  
  if (response.tools) {
    console.log("\nTools used:");
    response.tools.forEach((tool) => {
      console.log(`- ${tool.name}`);
    });
  }
}

/**
 * Example 2: Multi-turn conversation with memory
 */
async function example2() {
  console.log("\n=== Example 2: Multi-turn Conversation ===\n");

  const workerUrl = "http://localhost:8787";
  const sessionId = "session-" + Date.now();

  // First message
  console.log("User: Tell me about The Witcher 3");
  let response = await sendChatRequest(workerUrl, sessionId, [
    {
      role: "user",
      content: "Tell me about The Witcher 3",
    },
  ]);
  console.log("Assistant:", response.reply);

  // Follow-up message (agent has context from previous turn)
  console.log("\nUser: What platforms is it available on?");
  response = await sendChatRequest(workerUrl, sessionId, [
    {
      role: "user",
      content: "Tell me about The Witcher 3",
    },
    {
      role: "assistant",
      content: response.reply,
    },
    {
      role: "user",
      content: "What platforms is it available on?",
    },
  ]);
  console.log("Assistant:", response.reply);
}

/**
 * Example 3: Error handling
 */
async function example3() {
  console.log("\n=== Example 3: Error Handling ===\n");

  const workerUrl = "http://localhost:8787";

  try {
    // Invalid request (missing sessionId)
    await sendChatRequest(workerUrl, "", [
      {
        role: "user",
        content: "Hello",
      },
    ]);
  } catch (error) {
    console.log("Caught expected error:", (error as Error).message);
  }
}

/**
 * Example 4: Using with a frontend framework (React)
 */
const reactExample = `
// React component example
import { useState } from 'react';

export function ChatComponent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const sessionId = 'session-' + Date.now(); // In real app, persist this

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: input }
    ];
    
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatRequest(
        'https://your-worker.workers.dev',
        sessionId,
        newMessages
      );

      setMessages([
        ...newMessages,
        { role: 'assistant', content: response.reply }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        disabled={loading}
      />
      <button onClick={sendMessage} disabled={loading}>
        Send
      </button>
    </div>
  );
}
`;

/**
 * Run examples
 */
async function main() {
  console.log("RAWG Analytics Worker - Client Examples\n");
  console.log("Make sure the worker is running: npm run dev\n");

  try {
    await example1();
    await example2();
    await example3();

    console.log("\n=== Example 4: React Component ===");
    console.log(reactExample);
  } catch (error) {
    console.error("Error running examples:", error);
  }
}

// Uncomment to run examples:
// main();

// Export for use in other modules
export { sendChatRequest, type ChatMessage, type ChatRequest, type ChatResponse };

