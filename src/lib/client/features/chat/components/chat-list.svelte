<script lang="ts">
  import { Ellipsis, SquarePen } from "@lucide/svelte";

  type Chat = { id: string; title: string };

  const chats: Chat[] = [
    { id: "1", title: "Project Kickoff Notes" },
    { id: "2", title: "UI Feedback Discussion" },
    { id: "3", title: "Sprint Planning" },
    { id: "4", title: "AI Calendar Brainstorm" },
    { id: "5", title: "Meeting Recap" },
    {
      id: "6",
      title:
        "LorLorem ipsum dolor, sit amet consectetur adipisicing elit. praesentium, nemo ea beatae aliquam eaque perferendis officiis! Laboriosam.em"
    }
  ];

  function handleEllipsis(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    console.log("clicked...");
  }
</script>

<div class="w-full">
  <button class="btn my-2 px-2 btn-ghost text-left justify-start w-full">
    <SquarePen size="16" />
    New Chat
  </button>

  <p class="text-sm mx-2 text-muted text-accent my-1">Chats</p>

  <div>
    {#each chats as chat (chat.id)}
      <a
        href={`/chat/${chat.id}`}
        class="group flex items-center justify-between text-sm p-2 py-1.5 w-full rounded-lg hover:bg-base-200/80"
      >
        <span class="truncate flex-1">{chat.title}</span>

        <button
          class="btn btn-ghost btn-square btn-xs opacity-75 invisible group-hover:visible"
          onclick={handleEllipsis}
        >
          <Ellipsis size="15" />
        </button>
      </a>
    {/each}
  </div>
</div>
