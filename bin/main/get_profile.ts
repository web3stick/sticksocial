import { get_profile } from '$lib/near-social-js/main/fun_get_profile';
// ========================================
const account_id = process.argv[2] || 'sleet.near';
// ========================================
await get_profile(account_id);
// ========================================
