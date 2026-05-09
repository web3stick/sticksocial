import { near_social_js_get_fun } from '../../src/lib/near-social-js/main/fun_get';
// ========================================
const key = process.argv[2] || 'sleet.near/**';
// ========================================
await near_social_js_get_fun([key]);
// ========================================
