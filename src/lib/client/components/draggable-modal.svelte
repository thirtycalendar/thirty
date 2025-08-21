<script lang="ts">
  import { draggable, type DragPos } from "../actions/draggable";

  interface Props {
    title?: string;
    position?: DragPos;
    onClose?: () => void;
  }

  let { title = "Create event", position = { x: 80, y: 80 }, onClose }: Props = $props();

  let open = $state(false);
  let boxEl: HTMLDivElement | null = $state(null);
  let headerEl: HTMLDivElement | null = $state(null);

  // close on ESC
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
  };

  function close() {
    open = false;
    onClose?.();
  }

  // focus first element on open
  $effect(() => {
    if (open) {
      const el = boxEl?.querySelector<HTMLElement>(
        'input,select,textarea,button,[tabindex]:not([tabindex="-1"])'
      );
      el?.focus();
      document.addEventListener("keydown", onKey);
    } else {
      document.removeEventListener("keydown", onKey);
    }
  });

  // exposed helpers
  export function show(at?: DragPos) {
    if (at) position = at;
    open = true;
  }
  export function hide() {
    close();
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) close();
  }

  function onSubmit(e: Event) {
    e.preventDefault();
    // TODO: wire to your create-event action
    close();
  }
</script>

{#if open}
  <!-- Backdrop -->
  <div class="fixed inset-0 z-[100]" aria-hidden="true" onclick={handleBackdropClick}></div>

  <!-- Floating draggable box -->
  <div
    bind:this={boxEl}
    role="dialog"
    aria-modal="true"
    aria-label={title}
    class="bg-base-100 rounded-box outline-base-300 fixed z-[101] w-[92vw] max-w-md shadow-2xl outline-1 sm:w-[520px]"
    use:draggable={{
      handle: headerEl,
      boundary: "window",
      position,
      onDrag: (p) => (position = p)
    }}
    style="transform: translate3d({position.x}px, {position.y}px, 0)"
  >
    <div
      bind:this={headerEl}
      class="border-base-300 flex items-center gap-2 border-b p-3 select-none"
    >
      <div class="i-heroicons-calendar-days-20 h-5 w-5 opacity-80" aria-hidden="true"></div>
      <h3 class="text-base font-semibold">{title}</h3>
      <div class="ml-auto flex items-center gap-2">
        <button class="btn btn-ghost btn-xs" onclick={close} aria-label="Close">✕</button>
      </div>
    </div>

    <form class="space-y-3 p-4" onsubmit={onSubmit}>
      <div class="form-control">
        <label class="label" for=""><span class="label-text">Title</span></label>
        <input name="title" class="input input-bordered w-full" required />
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div class="form-control">
          <label class="label" for=""><span class="label-text">Start</span></label>
          <input type="datetime-local" name="start" class="input input-bordered w-full" required />
        </div>
        <div class="form-control">
          <label class="label" for=""><span class="label-text">End</span></label>
          <input type="datetime-local" name="end" class="input input-bordered w-full" required />
        </div>
      </div>

      <div class="form-control">
        <label class="label" for=""><span class="label-text">Location</span></label>
        <input name="location" class="input input-bordered w-full" />
      </div>

      <div class="form-control">
        <label class="label" for=""><span class="label-text">Description</span></label>
        <textarea name="desc" class="textarea textarea-bordered h-24"></textarea>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button type="button" class="btn btn-ghost" onclick={close}>Cancel</button>
        <button type="submit" class="btn btn-primary">Create</button>
      </div>
    </form>
  </div>
{/if}
