import type { Chat } from "@ai-sdk/svelte";

export function createChatForm(chat: Chat) {
  let textareaRef: HTMLTextAreaElement;

  function autoResize() {
    if (!textareaRef) return;
    textareaRef.style.height = "auto";
    // Cap the height with a max-height class on the element
    textareaRef.style.height = `${textareaRef.scrollHeight}px`;
  }

  function onsubmit(e: Event) {
    e.preventDefault();
    if (!chat.input.trim()) return;
    chat.handleSubmit();
    // Reset height after submit
    if (textareaRef) {
      textareaRef.style.height = "auto";
    }
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onsubmit(e);
    }
  }

  return {
    get textareaRef() {
      return textareaRef;
    },
    set textareaRef(el: HTMLTextAreaElement) {
      textareaRef = el;
    },
    onsubmit,
    onkeydown,
    oninput: autoResize
  };
}
