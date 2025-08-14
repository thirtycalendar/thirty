<script lang="ts">
  import { session } from "$lib/client/stores/user-session";
  import { cn } from "$lib/client/utils/cn";

  const menuItems: { name: string }[] = [{ name: "Settings" }];
</script>

{#if $session}
  <div class="dropdown dropdown-end">
    <button aria-label="User Profile" class="btn btn-circle">
      <img src={$session.image} alt="" class="border-base-300 w-8 rounded-full border-2" />
    </button>

    <ul class="dropdown-content menu bg-base-100 rounded-box border-base-200 mt-1 w-auto border">
      {#each menuItems as item (item.name)}
        <input
          type="radio"
          name={item.name}
          aria-label={item.name}
          class={cn(
            "btn btn-sm sm:btn-md btn-ghost hover:btn-secondary flex w-full min-w-[130px] items-center justify-start font-normal"
          )}
        />
      {/each}
    </ul>
  </div>
{/if}
