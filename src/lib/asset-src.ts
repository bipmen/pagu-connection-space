type AssetSource = string | { src: string };

export function getAssetSrc(asset: AssetSource): string {
  return typeof asset === "string" ? asset : asset.src;
}
