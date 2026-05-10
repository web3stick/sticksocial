import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";

export interface NearSocialGetOptions {
	keys: string[];
	blockHeight?: bigint;
	returnDeleted?: boolean;
	withBlockHeight?: boolean;
	withNodeId?: boolean;
	withTimestamp?: boolean;
	useApiServer?: boolean;
}

export async function near_social_js_get_fun(options: NearSocialGetOptions): Promise<Record<string, any> | null> {
	const result = (await near_social_client(near_kit_client()).get(options)) as Record<string, any> | null;
	return result;
}
