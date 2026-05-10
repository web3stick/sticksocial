import { marked } from "marked";

export function preprocess_post_text(text: string): string {
	if (!text) return "";
	return text
		.replace(/@([\w.-]+)/g, '<a href="/profile/$1">@$1</a>')
		// to do add hashtag route and feed
		.replace(/#(\w+)/g, '<a href="/hashtag/$1">#$1</a>');
}

export function render_post_text(text: string): string {
	if (!text) return "";
	const preprocessed = preprocess_post_text(text);
	return marked(preprocessed) as string;
}