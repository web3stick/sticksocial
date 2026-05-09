import { near_kit_client } from '@near-kit-tool-box/web';
import { near_social_client } from '../new';
import type { Profile } from 'near-social-js';
// ============================================
export async function get_profile(account_id: string): Promise<Profile | null> {
	return near_social_client(near_kit_client).getProfile(account_id);
}
// ============================================
