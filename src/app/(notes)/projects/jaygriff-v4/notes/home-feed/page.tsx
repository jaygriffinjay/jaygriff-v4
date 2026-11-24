// goatboat: a09b11b1-b486-493e-a228-e9bd4c7e4950
import { HomeFeed } from "@/components/site/home-feed";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { H2, Muted } from "@/components/typography";
import { getContentByPath, listFeed, type ContentItem } from "@/lib/goatboat";

const SAMPLE = 8;
const PLAYGROUND_PATH = "/projects/jaygriff-v4/notes/home-feed";
const SAMPLE_DATE = "2026-03-10";
const SAMPLE_IMAGE: ContentItem["assets"][number] = {
  id: 0,
  projectId: null,
  contentId: null,
  url: "/images/paint3.png",
  kind: "image",
  role: "hero",
  alt: "A colorful abstract drawing in a classic painting app",
  width: 1280,
  height: 720,
  sortOrder: 0,
  createdAt: `${SAMPLE_DATE}T00:00:00.000Z`,
};

function metadataSample(
  id: string,
  title: string,
  publishedAt: string | null,
  tags: string[] | null,
  authors: string[] | null,
  project: ContentItem["project"] = null,
): ContentItem {
  return {
    id,
    parentId: null,
    slug: id,
    path: PLAYGROUND_PATH,
    type: "post",
    status: "published",
    title,
    description: null,
    intro: null,
    body: null,
    toc: null,
    format: "md",
    componentKey: null,
    contentHash: null,
    authors,
    authorship: "human",
    authorshipNote: null,
    tags,
    projectId: null,
    publishedAt,
    revisedAt: null,
    sortOrder: 0,
    source: "db",
    file: null,
    missingSince: null,
    createdAt: `${SAMPLE_DATE}T00:00:00.000Z`,
    updatedAt: `${SAMPLE_DATE}T00:00:00.000Z`,
    link: null,
    project,
    section: null,
    assets: [],
  };
}

const METADATA_SAMPLES = [
  metadataSample("metadata-minimal", "Minimal metadata", `${SAMPLE_DATE}T15:05:00.000Z`, ["ui"], ["Jay Griffin"], {
    slug: "jaygriff-v4",
    title: "jaygriff-v4",
  }),
  metadataSample("metadata-no-tags", "No tags or project", `${SAMPLE_DATE}T16:17:00.000Z`, null, ["Jay Griffin"]),
  metadataSample(
    "metadata-many-short-tags",
    "Many short tags",
    `${SAMPLE_DATE}T17:30:00.000Z`,
    [
      "ui", "css", "layout", "mobile", "feed", "links", "notes", "testing", "design", "web",
      "art", "type", "code", "api", "site", "grid", "docs", "forms", "tools", "build",
      "data", "state", "hooks", "media",
    ],
    ["Jay Griffin"],
    { slug: "jaygriff-v4", title: "jaygriff-v4" },
  ),
  metadataSample(
    "metadata-long-tags",
    "Many long tags and project name",
    `${SAMPLE_DATE}T18:45:00.000Z`,
    [
      "responsive-layout-debugging", "content-metadata", "component-design-systems",
      "accessibility-testing", "server-rendered-content", "typography-scale-refinement",
      "incremental-feed-loading", "visual-hierarchy-testing", "responsive-media-delivery",
      "metadata-wrap-behavior",
    ],
    ["Jay Griffin", "Claude Sonnet 4.5", "GitHub Copilot"],
    { slug: "long-project-title", title: "A Project With a Deliberately Long Name" },
  ),
  metadataSample(
    "metadata-many-authors",
    "Many authors with long names",
    null,
    ["wrapping", "metadata", "stress-test"],
    [
      "Jay Griffin",
      "Claude Sonnet 4.5",
      "GitHub Copilot",
      "A Collaborator With an Unnecessarily Long Professional Name",
      "Another Contributor With a Different Long Name",
      "One More Person",
    ],
  ),
];

const PROJECT_TAG_FLOW_SAMPLES = [
  metadataSample(
    "project-tags-few",
    "Project with a few tags",
    `${SAMPLE_DATE}T19:00:00.000Z`,
    ["ui", "web"],
    ["Jay Griffin"],
    { slug: "jaygriff-v4", title: "jaygriff-v4" },
  ),
  metadataSample(
    "project-tags-near-line",
    "Project with tags near a full line",
    `${SAMPLE_DATE}T18:00:00.000Z`,
    ["responsive-design", "metadata", "content-layout", "frontend-ui", "testing"],
    ["Jay Griffin"],
    { slug: "jaygriff-v4", title: "jaygriff-v4" },
  ),
  metadataSample(
    "project-tags-overflow",
    "Project with tags flowing onto more lines",
    `${SAMPLE_DATE}T17:00:00.000Z`,
    [
      "responsive-layout-debugging", "content-metadata", "component-design-systems",
      "accessibility-testing", "server-rendered-content", "typography-scale-refinement",
      "incremental-feed-loading", "visual-hierarchy-testing", "responsive-media-delivery",
      "metadata-wrap-behavior",
    ],
    ["Jay Griffin"],
    { slug: "jaygriff-v4", title: "jaygriff-v4" },
  ),
];

const COMPACT_FULL_ENTRY: ContentItem = {
  ...metadataSample(
    "metadata-compact-entry",
    "A Compact Example Entry",
    `${SAMPLE_DATE}T15:05:00.000Z`,
    ["ui"],
    ["Jay"],
    { slug: "jaygriff-v4", title: "v4" },
  ),
  body: "I built this small visual experiment to see how a compact metadata row sits beneath a real entry.\n\nThe same image and article copy appear in both layouts, so only the metadata arrangement changes.",
  assets: [SAMPLE_IMAGE],
};

const IMAGE_EXAMPLE: ContentItem = {
  ...metadataSample(
    "metadata-image-entry",
    "Image-Led Example",
    `${SAMPLE_DATE}T16:05:00.000Z`,
    ["visual-design", "experiments"],
    ["Jay Griffin"],
    { slug: "jaygriff-v4", title: "jaygriff-v4" },
  ),
  body: "A picture can carry the first impression while the short description gives it context. This entry shows how an image, title, paragraph and metadata row work together.",
  assets: [SAMPLE_IMAGE],
};

const WRITING_EXAMPLE: ContentItem = {
  ...metadataSample(
    "metadata-writing-entry",
    "A Writing Item with More to Read",
    `${SAMPLE_DATE}T15:05:00.000Z`,
    ["writing", "interface-design"],
    ["Jay Griffin", "Claude Sonnet 4.5"],
    { slug: "jaygriff-v4", title: "jaygriff-v4" },
  ),
  body:
    "A writing entry often starts with a few paragraphs that set up the idea before the rest of the piece. This sample keeps those paragraphs long enough to exercise the excerpt boundary while still reading like ordinary prose in a feed. The goal is to see whether the metadata remains clear after the description wraps and the reader follows the continuation link.\n\n" +
    "The next paragraph adds another layer of context, with a second sentence to make the visible excerpt cross its target. When there is more content after the excerpt, the feed should show the remaining word count in brackets rather than collapsing the text or letting the card grow without limit.\n\n" +
    "A final paragraph proves the card still has meaningful content beyond the teaser.",
};

/** The newest rows, each as the full page, so entries have their body, project, authors and pictures. */
async function newest() {
  const { items } = await listFeed({ type: "all", hideStructure: true, limit: SAMPLE });
  const pages = await Promise.all(items.map((item) => getContentByPath(item.path)));
  return pages.flatMap((page): ContentItem[] => (page && !("redirectTo" in page) ? [page.item] : []));
}

export default async function HomeFeedPage() {
  const items = await newest();

  return (
    <PageLayout hideRelated>
      <PageHeader intro="The home page's Latest feed with a picture as wide as the column and more on each entry. The same real, newest pages shown with the picture in different places." />

      <H2>Metadata wrapping stress test</H2>
      <Muted>Default order: time, authors, project, tags. Content items currently support one project.</Muted>
      <Muted>Compact full entry, all metadata inline with dots:</Muted>
      <HomeFeed items={[COMPACT_FULL_ENTRY]} hero="above" metadataLayout="inline" metadataSeparators />
      <Muted>Long groups wrap inline without separators:</Muted>
      <HomeFeed items={METADATA_SAMPLES} hero="none" />
      <Muted>Project and tags share a line; tag count increases to show the wrap threshold.</Muted>
      <HomeFeed items={PROJECT_TAG_FLOW_SAMPLES} hero="none" metadataLayout="project-tags" />

      <H2>Full entries: image and writing</H2>
      <Muted>An image-led item and a multi-paragraph writing item with a more-words link, using the default metadata flow.</Muted>
      <HomeFeed items={[IMAGE_EXAMPLE, WRITING_EXAMPLE]} hero="above" />
      <Muted>Project followed by tags, with each tag flowing into the remaining line space:</Muted>
      <HomeFeed items={METADATA_SAMPLES} hero="none" metadataLayout="project-tags" />

      <H2>Above the title, shorter</H2>
      <Muted>A 2:1 strip, so the pictures take less of the page.</Muted>
      <HomeFeed items={items} hero="wide" />

      <H2>Between the title and the opening</H2>
      <Muted>The title leads, then the picture, then the opening.</Muted>
      <HomeFeed items={items} hero="between" />

      <H2>No picture</H2>
      <Muted>The same entries without pictures, to compare how much the picture adds.</Muted>
      <HomeFeed items={items} hero="none" />
    </PageLayout>
  );
}
