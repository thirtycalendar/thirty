<script>
  import { Chat } from "@ai-sdk/svelte";

  const chat = new Chat({ maxSteps: 30 });
</script>

<main>
  <ul>
    {#each chat.messages as message, messageIndex (messageIndex)}
      <li>
        <div>{message.role}</div>
        <div>
          {#each message.parts as part, partIndex (partIndex)}
            {#if part.type === "text"}
              <div>{part.text}</div>
            {:else if part.type === "tool-invocation"}
              <pre>{JSON.stringify(part.toolInvocation, null, 2)}</pre>
            {/if}
          {/each}
        </div>
      </li>
    {/each}
  </ul>

  <form onsubmit={chat.handleSubmit} class="mt-3">
    <input bind:value={chat.input} class="input" />
    <button type="submit" class="btn btn-primary">Send</button>
  </form>
</main>
