import { near_social_ipfs } from "../../ts/const";
// ============================================
// posts an image File to the NEAR Social IPFS add endpoint and
// returns "ipfs://<cid>". response may be bare cid text or
// json {"cid": "..."} — handle both.
// ============================================
export async function upload_image_fun(file: File): Promise<string> {
	const form = new FormData();
	form.append("file", file);
	const res = await fetch(`${near_social_ipfs.replace("/ipfs/", "/add")}`, {
		method: "POST",
		body: form
	});
	if (!res.ok) throw new Error(`upload failed: ${res.status} ${res.statusText}`);
	const text = await res.text();
	let cid = text.trim();
	try {
		const parsed = JSON.parse(cid);
		if (parsed && typeof parsed.cid === "string") cid = parsed.cid;
	} catch {
		/* response was the bare cid */
	}
	return `ipfs://${cid}`;
}
// ============================================
