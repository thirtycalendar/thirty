<script lang="ts">
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { createQuery } from "$lib/client/utils/query/create-query";

  type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
  };

  const {
    data: posts,
    error: queryError,
    isPending: loadingPosts
  } = createQuery<() => Promise<Post[]>, Error>({
    queryFn: async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return await res.json();
    },
    queryKeys: ["posts"]
  });

  const {
    mutate: createPost,
    data: createdPost,
    isPending: creatingPost,
    error: mutationError
  } = createMutation<(post: Omit<Post, "id">) => Promise<Post>, Error>({
    mutationFn: async (input) => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify(input),
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Failed to create post");
      return await res.json();
    },
    queryKeys: ["posts"]
  });

  function handleCreate() {
    createPost({
      userId: 1,
      title: "New Post",
      body: "This is a test post"
    });
  }
</script>

<button class="btn btn-primary mt-4" on:click={handleCreate} disabled={$creatingPost}>
  {#if $creatingPost}
    Creating...
  {:else}
    Create Post
  {/if}
</button>

{#if $createdPost}
  <p class="mt-4 text-green-600">
    ✅ Created post: {$createdPost.title}
  </p>
{/if}

{#if $mutationError}
  <p class="text-red-500">Create Error: {$mutationError.message}</p>
{/if}

{#if $loadingPosts}
  <p>Loading posts...</p>
{:else if $queryError}
  <p class="text-red-500">Error: {$queryError.message}</p>
{:else if $posts}
  <ul class="space-y-2">
    {#each $posts as post}
      <li class="border p-2 rounded">
        <strong>{post.title}</strong>
        <p>{post.body}</p>
      </li>
    {/each}
  </ul>
{/if}
