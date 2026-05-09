import { near_kit_client } from '@near-kit-tool-box/web';
import { near_social_client } from "../new";
// ============================================
export async function near_social_js_set_fun(
  signerId: string,
  data: Record<string, Record<string, unknown>>,
  options?: {
    deposit?: string;
    refundUnusedDeposit?: boolean;
  }
): Promise<any> {
  return near_social_client(near_kit_client).set({ signerId, data, ...options });
}
// ============================================