type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

const ASSET_HOST = "assets.jaygriff.com";

/** R2 images use Cloudflare resizing at full quality; local and other-host images pass through unchanged. */
export default function cloudflareImageLoader({ src, width }: ImageLoaderProps): string {
  let image: URL;
  try {
    image = new URL(src);
  } catch {
    return src;
  }

  if (image.hostname !== ASSET_HOST || image.pathname.toLowerCase().endsWith(".svg")) return src;

  const options = `width=${width},quality=100,format=auto`;
  return `${image.origin}/cdn-cgi/image/${options}${image.pathname}${image.search}`;
}
