import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "./new";
import type { Profile } from "near-social-js";
// ============================================
// Get a user's profile
const profile: Profile | null =
  await near_social_client(near_kit_client).getProfile(account_id);
// ============================================
