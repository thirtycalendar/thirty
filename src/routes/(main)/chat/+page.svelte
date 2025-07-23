<script lang="ts">
  import { client } from "$lib/client/utils/rpc";

  type ChatMessage = { role: "user" | "assistant"; content: string };

  let messages: ChatMessage[] = [];
  let input = "";
  let isStreaming = false;

  async function sendMessage() {
    if (!input.trim() || isStreaming) return;

    const userMsg: ChatMessage = { role: "user", content: input };
    messages = [...messages, userMsg];
    input = "";
    isStreaming = true;

    const res = await client.api.chat.$post({ json: { messages } });

    if (!res.body) {
      isStreaming = false;
      return;
    }

    const aiMsg: ChatMessage = { role: "assistant", content: "" };
    messages = [...messages, aiMsg];

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n");
      buffer = parts.pop() || "";

      for (const part of parts) {
        if (part.startsWith("0:")) {
          try {
            const token = JSON.parse(part.slice(2));
            aiMsg.content += token;
            messages = [...messages.slice(0, -1), aiMsg];
          } catch (err) {
            console.log("Error:", err);
            console.warn("Invalid token:", part);
          }
        }
      }
    }

    isStreaming = false;
  }
</script>

<div class="chat flex flex-col gap-2 p-4">
  {#each messages as m (m.role + m.content)}
    <div class={m.role === "user" ? "text-blue-500" : "text-green-500"}>
      {m.content}
    </div>
  {/each}

  {#if isStreaming}
    <p class="animate-pulse">Generating...</p>
  {/if}

  <div class="flex gap-2 mt-2">
    <input
      class="flex-1 border px-2 py-1"
      bind:value={input}
      placeholder="Type your message..."
      onkeydown={(e) => e.key === "Enter" && sendMessage()}
    />
    <button class="bg-blue-500 text-white px-3" onclick={sendMessage}>Send</button>
  </div>
</div>
