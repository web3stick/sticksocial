import { get_account_id_profile } from "../../src/lib/near-social-js/helper/get_account_id_profile";
// ========================================
const accountId = process.argv[2] || "root.near";
// ========================================
console.log("=================");
console.log(accountId);
const result = await get_account_id_profile(accountId);
console.log(result);
console.log("=================");