<script lang="ts">
  import { ChoiceField } from "$lib/client/components";

  let currentTheme = $state("Dark");
  const themes = ["Dark", "Light"];
</script>

<div class="max-w-[200px]">
  <ChoiceField value={currentTheme} choiceList={themes} />
</div>
