import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
interface GetNodesOptions {
	fromIndex?: number;
	limit?: number;
}
// ============================================
export async function near_social_js_get_nodes_fun(
	options?: GetNodesOptions
): Promise<Record<string, unknown> | null> {
	// =================
	const result = await near_social_client(near_kit_client()).getNodes(options);
	// =================
	console.log("=================");
	console.log("getNodes()");
	console.log(options);
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================