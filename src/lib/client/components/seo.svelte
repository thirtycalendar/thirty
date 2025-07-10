<script lang="ts">
  interface Props {
    seo: {
      title: string;
      description: string;
      url: string;
      image: string;
      twitterHandle: string;
    };
  }

  let { seo }: Props = $props();
  let { title, description, url, image, twitterHandle } = seo;

  // let structuredData = JSON.stringify({
  //   "@context": "https://schema.org",
  //   "@type": "WebPage",
  //   name: title,
  //   description: description,
  //   url: url,
  //   image: image,
  //   author: {
  //     "@type": "Person",
  //     name: { title }
  //   }
  // });
</script>

<svelte:head>
  <!-- Basic SEO Meta Tags -->
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href={url} />

  <!-- Open Graph Tags (for Facebook, LinkedIn, etc.) -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:url" content={url} />
  <meta property="og:type" content="website" />
  <!-- <meta property="og:site_name" content="Your Website Name" /> -->
  <meta property="og:site_name" content={title} />

  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  <meta name="twitter:site" content={twitterHandle} />

  <!-- Theme Color (for mobile browsers) -->
  <meta name="theme-color" content="#ffffff" />
</svelte:head>
