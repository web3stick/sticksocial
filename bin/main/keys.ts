import { near_social_js_keys_fun } from "../../src/lib/near-social-js/main/fun_keys";
// ========================================
const key = process.argv[2] || "sleet.near/*";
// ========================================
await near_social_js_keys_fun([key]);
// ========================================
