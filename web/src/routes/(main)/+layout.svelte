<script lang="ts">
  let { children } = $props();
</script>

<div class="max-h-screen overflow-y-scroll">
  {@render children()}
</div>
