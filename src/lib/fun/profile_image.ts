import { near_social_ipfs } from "../ts/const";
// for  accountId/profile/image or accountId/profile/backgroundImage
// ============================================
export function profile_image_fun(accountId: string): string {
    if (!accountId) return '';
    return `https://i.near.social/large/https://near.social/magic/img/account/${accountId}`;
}
// ============================================
export function resolve_image_url_fun(image: { ipfs_cid?: string; url?: string } | undefined): string {
    if (!image) return '';
    if (image.ipfs_cid) return near_social_ipfs + image.ipfs_cid;
    if (image.url) return image.url;
    return '';
}
// ========================================
// 