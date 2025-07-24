<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";

  const chat = new Chat({ maxSteps: 100 });

  function onsubmit(e: Event) {
    e.preventDefault();
    chat.handleSubmit();
  }
</script>

<main class="flex h-screen flex-col p-5 max-w-[900px] m-auto">
  <ul class="flex-1 overflow-y-auto p-6 space-y-8">
    {#each chat.messages as message, i (i)}
      <li class={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
        <div
          class={`${message.role === "user" && "bg-base-300 text-base-content max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl"}`}
        >
          {#each message.parts as part, j (j)}
            {#if part.type === "text"}
              <div class="whitespace-pre-wrap">{part.text}</div>
            {/if}
          {/each}
        </div>
      </li>
    {/each}

    {#if chat.status === "submitted"}
      <li class="animate-pulse">Generating...</li>
    {/if}
  </ul>

  <form {onsubmit} class="p-4 flex items-center gap-2">
    <input
      bind:value={chat.input}
      class="input focus:outline-none flex-1"
      placeholder="Send a message..."
    />
    <button type="submit" class="btn btn-primary" disabled={!chat.input.trim()}> Send </button>
  </form>
</main>
