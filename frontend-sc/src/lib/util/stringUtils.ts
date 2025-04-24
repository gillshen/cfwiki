const startsWithCjk = (s: string) => s.charCodeAt(0) >= 19968;

export function lexicalChineseLast(a: string, b: string): number {
	if (startsWithCjk(a) && startsWithCjk(b)) {
		return a.localeCompare(b, 'zh-CN');
	} else {
		return a.localeCompare(b, 'en-US-u-kf-upper');
	}
}

export function splitAtChineseRuns(input: string): string[] {
	return input.split(/([\u4E00-\u9FFF]+)/g).filter(Boolean);
}

export function padChineseRuns(input: string): string {
	return splitAtChineseRuns(input).join('\u200a');
}

export function toTitleCase(s: string): string {
	if (!s) {
		return '';
	}
	return `${s[0].toUpperCase()}${s.slice(1)}`;
}
