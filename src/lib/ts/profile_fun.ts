import { near_social_ipfs } from './const.ts'
import { nft_get_image_url_fun } from './fun_get_nft_image.ts'
import { near_kit_client } from '@near-kit-tool-box/web'
// ========================================
export function resolveImageUrl(image: { ipfs_cid?: string; url?: string } | undefined): string {
    if (!image) return '';
    if (image.ipfs_cid) return near_social_ipfs + image.ipfs_cid;
    if (image.url) return image.url;
    return '';
}
// ========================================
export async function resolveProfileImageUrl(
	image: { ipfs_cid?: string; url?: string; nft?: { contractId: string; tokenId: string } } | undefined
): Promise<string> {
    if (!image) return '';
    if (image.nft?.contractId && image.nft?.tokenId) {
        const url = await nft_get_image_url_fun(near_kit_client(), image.nft.contractId, image.nft.tokenId);
        return url ?? resolveImageUrl(image);
    }
    return resolveImageUrl(image);
}
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