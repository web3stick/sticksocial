import { near_kit_client } from '@near-kit-tool-box/web';
import { near_social_client } from '../new';
// ============================================
export async function near_social_js_index_fun(
	action: string,
	key: string,
	options?: {
		accountId?: string | string[];
		order?: 'asc' | 'desc';
		limit?: number;
		from?: number;
	}
): Promise<any> {
	// =================
	const result = await near_social_client(near_kit_client).index({ action, key, ...options });
	// =================
	console.log('=================');
	console.log('index()');
	console.log({ action, key, options });
	console.log('=================');
	console.log(result);
	console.log('=================');
	// =================
	return result;
}
// ============================================
