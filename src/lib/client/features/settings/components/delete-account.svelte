<script lang="ts">
  let confirming = $state(false);

  function handleDelete() {
    // actual delete account logic
  }

  function toggleConfirm() {
    confirming = !confirming;
  }
</script>

<div class="flex w-full max-w-xl flex-col gap-4 py-4">
  <p class="text-primary-content/80 text-sm">
    We'd be sad to see you go. Deleting your account will remove all your calendars, events, and
    chat historys permanently. There's no way to recover this data once it's gone.
  </p>

  <p class="text-primary-content/60 text-sm italic">
    Want a break instead? You can pause notifications or downgrade to the Free plan without losing
    anything.
  </p>

  {#if confirming}
    <div class="flex flex-col gap-2">
      <p class="text-error my-2 text-sm font-medium">
        Are you absolutely sure? This action cannot be undone.
      </p>
      <div class="flex gap-3">
        <button onclick={toggleConfirm} class="btn btn-secondary">Cancel, keep my account</button>
        <button onclick={handleDelete} class="btn btn-error">Yes, I sm sure</button>
      </div>
    </div>
  {:else}
    <button onclick={toggleConfirm} class="btn btn-error"> Delete my account </button>
  {/if}
</div>
