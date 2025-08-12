<script lang="ts">
  import { Favicon } from "$lib/client/assets";

  import "../app.css";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={Favicon} />
</svelte:head>

{@render children?.()}
