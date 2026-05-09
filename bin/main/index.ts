import { near_social_js_index_fun } from "../../src/lib/near-social-js/main/fun_index";
// ========================================
// index --action <action> --key <key> [--accountId <accountId>] [--order <asc|desc>] [--limit <number>]
// ========================================
const args = process.argv.slice(2);
const getArg = (flag: string) => {
	const idx = args.indexOf(flag);
	return idx >= 0 ? args[idx + 1] : undefined;
};
const action = getArg("--action") || "post";
const key = getArg("--key") || "main";
const accountId = getArg("--accountId");
const order = getArg("--order") as "asc" | "desc" | undefined;
const limit = getArg("--limit") ? parseInt(getArg("--limit")!) : undefined;
// ========================================
await near_social_js_index_fun(action, key, { accountId, order, limit });
// ========================================
