<script lang="ts">
  import { DemoImage, LogoImage } from "$lib/client/assets";

  const githubUrl = "https://github.com/thirtycalendar/thirty";
  const getStartedUrl = "/auth";
</script>

<div class="navbar bg-base-100 fixed top-0 right-0 left-0 z-50 m-auto max-w-5xl">
  <div class="flex-1">
    <a href="/" class="flex items-center gap-1 text-xl font-bold">
      <img src={LogoImage} alt="Thirty Logo" class="h-8 w-8" />
    </a>
  </div>

  <div class="hidden flex-none gap-2 sm:flex">
    <a href={githubUrl} target="_blank" class="btn btn-ghost">⭐ Star on GitHub</a>
    <a href={getStartedUrl} class="btn btn-primary-content">Get Started</a>
  </div>

  <div class="flex-none sm:hidden">
    <a href={getStartedUrl} class="btn btn-primary-content btn-sm">Get Started</a>
  </div>
</div>

<section class="mx-auto max-w-2xl px-3 pt-32 pb-20 text-center">
  <h1 class="text-4xl font-bold sm:text-5xl">
    Your Calendar. Smarter, Open, and Always Listening.
  </h1>
  <p class="mt-4 text-lg opacity-70">
    Thirty is the open AI calendar you talk to, and it organizes your life.
  </p>

  <div class="mt-8 flex justify-center gap-3">
    <a
      href={getStartedUrl}
      class="btn btn-primary-content btn-lg flex min-w-[250px] items-center gap-2"
    >
      Get Started <span class="font-normal">→</span>
    </a>
  </div>
</section>

<section class="mx-auto max-w-6xl px-4 pb-20">
  <img
    src={DemoImage}
    alt="Dashboard Preview"
    class="ring-base-300 rounded-2xl shadow-2xl ring-10"
    loading="lazy"
  />
</section>
