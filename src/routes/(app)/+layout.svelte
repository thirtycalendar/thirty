<script lang="ts">
  let { children } = $props();
</script>

<div class="bg-base-200 w-full">
  {@render children?.()}
</div>
