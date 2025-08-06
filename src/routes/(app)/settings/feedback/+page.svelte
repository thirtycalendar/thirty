<script lang="ts">
  import { Feedback, Navbar } from "$lib/client/features/settings/components";
  import { Seo } from "$lib/client/components";

  let { data } = $props();
</script>

<Seo seo={data.seo} />

<Navbar title="Feedback" />

<Feedback />
