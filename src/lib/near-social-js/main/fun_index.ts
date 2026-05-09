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
	return near_social_client(near_kit_client).index({ action, key, ...options });
}
// ============================================
