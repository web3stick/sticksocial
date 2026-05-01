import { near_social_ipfs } from './const.ts'
// ========================================
export function resolveImageUrl(image: { ipfs_cid?: string; url?: string } | undefined): string {
    if (!image) return '';
    if (image.ipfs_cid) return near_social_ipfs + image.ipfs_cid;
    if (image.url) return image.url;
    return '';
}
// ========================================
export function thumb(imageUrl: string, size = 'large'): string {
    return imageUrl && !imageUrl.startsWith('data:image/')
        ? `https://i.near.social/${size}/${imageUrl}`
        : imageUrl;
}
// ========================================
// ========================================
export function resolveLinkUrl(platform: string, value: string): string {
    if (!value) return '';
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    if (platform === 'twitter') return `https://twitter.com/${value}`;
    if (platform === 'github') return `https://github.com/${value}`;
    if (platform === 'telegram') return `https://t.me/${value}`;
    if (platform === 'website') return value.startsWith('http') ? value : `https://${value}`;
    return value;
}
// ========================================