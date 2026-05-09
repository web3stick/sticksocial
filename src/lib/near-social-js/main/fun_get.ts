import { near_kit_client } from '@near-kit-tool-box/web';
import { near_social_client } from '../new';
// ============================================
export async function near_social_js_get_fun(keys: string[]): Promise<Record<string, any> | null> {
	return near_social_client(near_kit_client).get({ keys }) as Promise<Record<string, any> | null>;
}
// ============================================
