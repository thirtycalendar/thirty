<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";

  const chat = new Chat({ maxSteps: 100 });

  function onsubmit(e: Event) {
    e.preventDefault();

    chat.handleSubmit();
  }
</script>

<main class="flex h-screen flex-col">
  <div class="flex flex-1 flex-col overflow-y-auto">
    <div class="mx-auto w-full max-w-[900px] flex-1 p-1">
      <ul class="space-y-8 pb-4">
        {#each chat.messages as message, i (i)}
          <li class={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              class={`${message.role === "user" && "bg-base-300 text-base-content max-w-xs md:max-w-md lg:max-w-lg px-3 py-2 rounded-xl"}`}
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
    </div>

    <form {onsubmit} class="sticky bottom-5 flex w-full items-center p-2">
      <div class="mx-auto w-full max-w-[900px] flex items-center gap-2">
        <input
          bind:value={chat.input}
          class="input input-bordered focus:outline-none flex-1"
          placeholder="Send a message..."
        />

        <button type="submit" class="btn btn-primary" disabled={!chat.input.trim()}> Send </button>
      </div>
    </form>
  </div>
</main>
