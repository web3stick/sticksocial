import { near_social_ipfs } from './const.ts'
// ========================================
export function resolveImageUrl(image: { ipfs_cid?: string; url?: string } | undefined): string {
    if (!image) return '';
    if (image.ipfs_cid) return near_social_ipfs + image.ipfs_cid;
    if (image.url) return image.url;
    return '';
}
// ========================================