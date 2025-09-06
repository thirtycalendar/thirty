<script lang="ts">
  import { Themes } from "$lib/shared/constants";
  import type { Theme } from "$lib/shared/types";

  import { ChoiceField } from "..";

  const activeTheme = $state<Theme>("light");
</script>

<div class="space-y-3">
  <div class="flex items-center justify-between">
    <p class="text-base-content/80 flex-1">Theme</p>

    <ChoiceField class="flex-0" value={activeTheme} choiceList={Themes} />
  </div>
</div>
