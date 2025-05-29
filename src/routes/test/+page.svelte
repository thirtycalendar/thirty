<script lang="ts">
  import { createMutation } from "$lib/ui/utils/query/create-mutation";
  import { createQuery } from "$lib/ui/utils/query/create-query";

  interface User {
    userId: number;
    id: number;
    title: string;
    body: string;
  }

  const { data, error, isPending } = createQuery<User[]>({
    queryFn: () => fetch("https://jsonplaceholder.typicode.com/posts").then((res) => res.json()),
    queryKeys: ["posts"],
    onSuccess: () => console.log("Posts loaded")
  });

  const { mutate, isPending: mutationPending } = createMutation<User>({
    mutationFn: (data) =>
      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      }).then((r) => r.json()),
    queryKeys: ["posts"],
    onSuccess: (d) => console.log("Post updated", d)
  });

  function onclick() {
    mutate({
      userId: 1,
      id: 1,
      title: "New Title",
      body: "New Body Content"
    });
  }
</script>

{#if $isPending}
  <p>Loading...</p>
{:else if $error}
  <p>Error: {$error}</p>
{:else if $data}
  <ul>
    {#each $data.slice(0, 4) as post}
      <li><strong>{post.title}</strong></li>
      <br />
    {/each}
  </ul>
{/if}

<button {onclick} class="btn" disabled={$mutationPending}>Mutate</button>
