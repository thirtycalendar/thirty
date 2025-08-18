<script lang="ts">
  import { Toast } from "$lib/client/components";
  import { Navbar } from "$lib/client/components/home";

  let { children } = $props();
</script>

<Toast />

<Navbar />

<div class="mt-15">
  {@render children()}
</div>
