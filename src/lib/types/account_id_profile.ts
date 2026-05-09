import { z } from 'zod';
import type { Profile } from 'near-social-js';
// ============================================
const account_id_profile_image_schema = z
	.object({
		ipfs_cid: z.string().optional(),
		url: z.string().optional()
	})
	.refine((data) => data.ipfs_cid !== undefined || data.url !== undefined, {
		message: 'Image must have ipfs_cid or url'
	});
// ============================================
const account_id_profile_nft_image_schema = z.object({
	nft: z.object({
		contractId: z.string(),
		tokenId: z.string()
	})
});
// ============================================
const account_id_profile_image_or_nft_schema = z.union([
	account_id_profile_image_schema,
	account_id_profile_nft_image_schema
]);
// ============================================
export const account_id_profile_schema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	image: account_id_profile_image_or_nft_schema.optional(),
	backgroundImage: account_id_profile_image_or_nft_schema.optional(),
	linktree: z.record(z.string(), z.string()).optional(),
	tags: z.record(z.string(), z.string()).optional()
});
// ============================================
export type account_id_profile = z.infer<typeof account_id_profile_schema>;
// ============================================
