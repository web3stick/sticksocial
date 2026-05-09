import { near_kit_client } from '@near-kit-tool-box/web';
import { near_social_client } from '../new';
// ============================================
export async function near_social_js_keys_fun(keys: string[]): Promise<Record<string, any> | null> {
	// =================
	const result = (await near_social_client(near_kit_client).keys({ keys })) as Record<
		string,
		any
	> | null;
	// =================
	console.log('=================');
	console.log('/keys/' + keys.join(','));
	console.log(result);
	console.log('=================');
	// =================
	return result;
}
// ============================================
