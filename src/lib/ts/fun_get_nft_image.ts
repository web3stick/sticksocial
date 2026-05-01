import type { Near } from 'near-kit';
import { nft_contract_methods } from '$lib/ts/contract_nft_const';
import { near_social_ipfs } from '$lib/ts/const';
// ===========================================
interface NftMetadata {
	base_uri?: string;
}
interface TokenMetadata {
	media?: string;
	reference?: string;
}
interface TokenData {
	metadata?: TokenMetadata;
}
// ===========================================
export async function nft_get_image_url_fun(
	near: Near,
	contractId: string,
	tokenId: string,
): Promise<string | null> {
	const [nftMetadata, tokenData] = await Promise.all([
		near.view<NftMetadata>(contractId, nft_contract_methods.nft_metadata),
		near.view<TokenData>(contractId, nft_contract_methods.nft_token, { token_id: tokenId }),
	]);

	if (!nftMetadata || !tokenData) return null;

	const tokenMetadata = tokenData.metadata;
	const tokenMedia = tokenMetadata?.media ?? '';

	let imageUrl: string | null = null;

	if (tokenMedia.startsWith('https://') || tokenMedia.startsWith('http://') || tokenMedia.startsWith('data:image')) {
		imageUrl = tokenMedia;
	} else if (tokenMedia) {
		imageUrl = nftMetadata.base_uri
			? `${nftMetadata.base_uri}/${tokenMedia}`
			: tokenMedia.startsWith('Qm') || tokenMedia.startsWith('ba')
				? `${near_social_ipfs}${tokenMedia}`
				: tokenMedia;
	} else if (tokenMetadata?.reference) {
		const ref = tokenMetadata.reference;
		if (nftMetadata.base_uri === 'https://arweave.net' && !ref.startsWith('https://')) {
			const res = await fetch(`${nftMetadata.base_uri}/${ref}`);
			const data = await res.json();
			imageUrl = data.media ?? null;
		} else if (ref.startsWith('https://') || ref.startsWith('http://')) {
			const res = await fetch(ref);
			const data = await res.json();
			imageUrl = data.media ?? null;
		} else if (ref.startsWith('ar://')) {
			const res = await fetch(`https://arweave.net/${ref.split('//')[1]}`);
			const data = await res.json();
			imageUrl = data.media ?? null;
		}
	}

	return imageUrl;
}
// ===========================================