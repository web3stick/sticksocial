import { Social } from "near-social-js";
import { Near } from "near-kit";
// ============================================
export function near_social_client(near: Near) {
  const social = new Social({ near });
  return social;
}
// ============================================