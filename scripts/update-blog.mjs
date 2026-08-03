#!/usr/bin/env node
/**
 * Regenerates the Blog section of index.html from the Medium RSS feed.
 *
 *   node scripts/update-blog.mjs
 *
 * The feed only exposes the 10 most recent stories, so anything older lives in
 * scripts/extra-posts.json and gets appended after the feed items.
 *
 * Banner images are downloaded into assets/images/blog/ so the published page
 * never depends on Medium's CDN at runtime.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FEED_URL = "https://medium.com/feed/@khawaja.muhammad.mushood";
const SITE_URL = "https://mushood123.github.io";
const IMAGE_DIR = join(ROOT, "assets", "images", "blog");
const FALLBACK_IMAGE = "./assets/images/blog-6.jpg";
const EXCERPT_MAX = 200;
/** Cards render at ~340 CSS px wide; 800 covers retina without wasting bytes. */
const BANNER_WIDTH = 800;

/**
 * Per-post tweaks keyed by the Medium post id (the hash at the end of the URL).
 * Use this when the auto-picked category is off, or when a story has no banner
 * image in the feed and an image already exists in assets/images/.
 */
const OVERRIDES = {
  f78689c7fa45: { category: "CI/CD" },
  "1b76e8bda010": { category: "Axios" },
  "759c43bfe382": { category: "Express.js", image: "./assets/images/mkcert.jpg" },
  "679ee875e685": { category: "React", image: "./assets/images/zustand.png" },
};

/** Medium tag slug -> label shown on the card. */
const CATEGORY_LABELS = {
  ai: "AI",
  api: "API",
  "api-integration": "API",
  axios: "Axios",
  "axios-interceptor": "Axios",
  backend: "Backend",
  "backend-development": "Backend",
  "best-practices": "Best Practices",
  chatbots: "Chatbots",
  chatgpt: "ChatGPT",
  "ci-cd-pipeline": "CI/CD",
  "clean-code": "Clean Code",
  "cloud-computing": "Cloud",
  devops: "DevOps",
  docker: "Docker",
  "front-end-development": "Frontend",
  "full-stack-developer": "Full Stack",
  git: "Git",
  github: "GitHub",
  "github-actions": "GitHub Actions",
  javascript: "JavaScript",
  nestjs: "Nest.js",
  networking: "Networking",
  nextjs: "Next.js",
  nodejs: "Node.js",
  openai: "OpenAI",
  postgresql: "PostgreSQL",
  "pull-request": "Git",
  python: "Python",
  react: "React",
  "react-native": "React Native",
  redis: "Redis",
  "rest-api": "REST API",
  security: "Security",
  "software-development": "Engineering",
  "software-engineering": "Engineering",
  "state-management": "React",
  "system-design-concepts": "System Design",
  "system-design-interview": "System Design",
  typescript: "TypeScript",
  vpn: "VPN",
};

/**
 * Most specific tags first. Medium orders tags arbitrarily, so the first tag is
 * often the least interesting one; pick the highest-ranked match instead.
 */
const CATEGORY_PRIORITY = [
  "react",
  "react-native",
  "nextjs",
  "nestjs",
  "redis",
  "postgresql",
  "docker",
  "vpn",
  "axios",
  "github-actions",
  "ci-cd-pipeline",
  "devops",
  "system-design-concepts",
  "cloud-computing",
  "ai",
  "openai",
  "typescript",
  "nodejs",
  "javascript",
  "rest-api",
  "api",
  "security",
  "git",
  "networking",
  "python",
  "front-end-development",
  "backend-development",
  "backend",
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const decodeEntities = (value) =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const collapse = (value) => value.replace(/\s+/g, " ").trim();

const cdata = (block, tag) => {
  const match = block.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
  return match ? match[1] : "";
};

const pickCategory = (tags) => {
  const ranked = CATEGORY_PRIORITY.find((tag) => tags.includes(tag));
  const slug = ranked ?? tags[0];
  if (!slug) return "Engineering";
  return (
    CATEGORY_LABELS[slug] ??
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
};

const buildExcerpt = (html) => {
  const blocks = [...html.matchAll(/<(p|blockquote)[^>]*>([\s\S]*?)<\/\1>/g)]
    .map((match) =>
      collapse(decodeEntities(match[2].replace(/<[^>]+>/g, " ")))
        .replace(/\s+([.,;:!?])/g, "$1")
        .replace(/\s+’/g, "’"),
    )
    .filter((text) => text.length > 30);

  // A lead-in line ("…messaged me late at night:") only makes sense with
  // whatever followed it, so keep pulling blocks in until the sentence lands.
  let text = blocks[0] ?? "";
  for (let i = 1; i < blocks.length && text.endsWith(":") && text.length < EXCERPT_MAX; i += 1) {
    text = `${text} ${blocks[i]}`;
  }

  if (text.length <= EXCERPT_MAX) return text;

  const clipped = text.slice(0, EXCERPT_MAX);
  const boundary = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, boundary > 0 ? boundary : EXCERPT_MAX).replace(/[,.;:—-]+$/, "")}…`;
};

/** Skip Medium's 1x1 view-tracking pixel when hunting for a banner. */
const findBanner = (html) => {
  for (const match of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    const src = decodeEntities(match[1]);
    if (!src.includes("medium.com/_/stat")) return src;
  }
  return null;
};

/**
 * The feed links full-size PNGs (often ~1 MB each). Medium's image CDN will
 * resize and re-encode on request, which brings the same banner down to ~30 KB.
 */
const optimize = (url) => {
  const asset = url.match(/([\w-]*\*[\w-]+\.(?:png|jpe?g|gif|webp))/i)?.[1];
  return asset
    ? { url: `https://miro.medium.com/v2/resize:fit:${BANNER_WIDTH}/format:webp/${asset}`, extension: "webp" }
    : { url, extension: (url.match(/\.(png|jpe?g|gif|webp)(?:$|\?)/i)?.[1] ?? "png").toLowerCase() };
};

const downloadBanner = async (source, postId) => {
  const { url, extension } = optimize(source);
  const filename = `${postId}.${extension === "jpeg" ? "jpg" : extension}`;
  const localPath = join(IMAGE_DIR, filename);
  const publicPath = `./assets/images/blog/${filename}`;

  if (existsSync(localPath)) return publicPath;

  const response = await fetch(url);
  if (!response.ok) {
    console.warn(`  ! banner download failed (${response.status}) for ${postId}`);
    return null;
  }

  await mkdir(IMAGE_DIR, { recursive: true });
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(localPath, bytes);
  console.log(`  + saved ${publicPath} (${Math.round(bytes.length / 1024)} KB)`);
  return publicPath;
};

const parseFeed = async (xml) => {
  const posts = [];

  for (const block of xml.split("<item>").slice(1)) {
    const link = cdata(block, "link").split("?")[0];
    const postId = link.split("/").pop().split("-").pop();
    const override = OVERRIDES[postId] ?? {};
    const tags = [...block.matchAll(/<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g)].map(
      (match) => match[1],
    );
    const content = cdata(block, "content:encoded");
    const published = new Date(cdata(block, "pubDate"));
    const banner = findBanner(content);

    console.log(`- ${decodeEntities(cdata(block, "title"))}`);

    posts.push({
      title: decodeEntities(cdata(block, "title")),
      url: link,
      date: published,
      category: override.category ?? pickCategory(tags),
      excerpt: buildExcerpt(content),
      image:
        override.image ??
        (banner ? await downloadBanner(banner, postId) : null) ??
        FALLBACK_IMAGE,
    });
  }

  return posts;
};

const formatDate = (date) =>
  `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;

const isoDate = (date) => date.toISOString().slice(0, 10);

const renderCards = (posts) =>
  posts
    .map(
      (post) => `              <li class="blog-post-item">
                <a href="${escapeHtml(post.url)}" target="_blank" rel="noopener">
                  <figure class="blog-banner-box">
                    <img
                      src="${escapeHtml(post.image)}"
                      alt="${escapeHtml(post.title)}"
                      loading="lazy"
                      class="blog-banner"
                    />
                  </figure>

                  <div class="blog-content">
                    <div class="blog-meta">
                      <p class="blog-category">${escapeHtml(post.category)}</p>

                      <span class="dot"></span>

                      <time datetime="${isoDate(post.date)}">${formatDate(post.date)}</time>
                    </div>

                    <h3 class="h3 blog-item-title">${escapeHtml(post.title)}</h3>

                    <p class="blog-text">${escapeHtml(post.excerpt)}</p>
                  </div>
                </a>
              </li>`,
    )
    .join("\n\n");

const renderJsonLd = (posts) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Khawaja Muhammad Mushood — Engineering Blog",
    url: "https://medium.com/@khawaja.muhammad.mushood",
    author: {
      "@type": "Person",
      name: "Khawaja Muhammad Mushood",
      url: `${SITE_URL}/`,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: post.url,
      datePublished: isoDate(post.date),
      description: post.excerpt,
      image: post.image.replace("./", `${SITE_URL}/`),
      keywords: post.category,
      author: {
        "@type": "Person",
        name: "Khawaja Muhammad Mushood",
      },
    })),
  };

  const json = JSON.stringify(schema, null, 2)
    .split("\n")
    .map((line) => `      ${line}`)
    .join("\n");

  return `    <script type="application/ld+json">\n${json}\n    </script>`;
};

const replaceBlock = (html, marker, body) => {
  const start = `<!-- ${marker}:START -->`;
  const end = `<!-- ${marker}:END -->`;
  const pattern = new RegExp(`(${start})[\\s\\S]*?(${end})`);

  if (!pattern.test(html)) {
    throw new Error(`Missing ${start} / ${end} markers in index.html`);
  }

  return html.replace(pattern, `$1\n${body}\n${indentOf(html, start)}$2`);
};

const indentOf = (html, marker) => {
  const line = html.slice(0, html.indexOf(marker)).split("\n").pop();
  return " ".repeat(line.length);
};

const main = async () => {
  console.log(`Fetching ${FEED_URL}`);
  const response = await fetch(FEED_URL, {
    headers: { "User-Agent": "mushood123.github.io blog sync" },
  });
  if (!response.ok) throw new Error(`Feed request failed: ${response.status}`);

  const feedPosts = await parseFeed(await response.text());
  if (feedPosts.length === 0) throw new Error("Feed returned no items — refusing to wipe the blog");

  const extras = JSON.parse(await readFile(join(ROOT, "scripts", "extra-posts.json"), "utf8")).map(
    (post) => ({ ...post, date: new Date(post.date) }),
  );

  const seen = new Set(feedPosts.map((post) => post.url));
  const posts = [...feedPosts, ...extras.filter((post) => !seen.has(post.url))].sort(
    (a, b) => b.date - a.date,
  );

  const indexPath = join(ROOT, "index.html");
  let html = await readFile(indexPath, "utf8");
  html = replaceBlock(html, "BLOG_POSTS", renderCards(posts));
  html = replaceBlock(html, "BLOG_JSONLD", renderJsonLd(posts));
  await writeFile(indexPath, html);

  console.log(`\nWrote ${posts.length} posts (${feedPosts.length} from the feed) to index.html`);
};

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exit(1);
});
