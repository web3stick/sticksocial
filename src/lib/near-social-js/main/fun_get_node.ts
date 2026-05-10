import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
interface GetNodeOptions {
	fromIndex?: number;
	limit?: number;
}
// ============================================
export async function near_social_js_get_node_fun(
	nodeId: number,
	options?: GetNodeOptions
): Promise<Record<string, unknown> | null> {
	// =================
	const result = await near_social_client(near_kit_client()).getNode({ nodeId, ...options });
	// =================
	console.log("=================");
	console.log("getNode()");
	console.log({ nodeId, options });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================
