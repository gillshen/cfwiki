export const emoji = {
	snail: '🐌',
	butterfly: '🦋',
	bug: '🐛',
	ant: '🐜',
	bee: '🐝',
	beetle: '🪲',
	ladybug: '🐞',
	cricket: '🦗'
};

export const randomEmoji = (): string => {
	const emojiArray: string[] = Object.values(emoji);
	return emojiArray[Math.floor(Math.random() * emojiArray.length)];
};
