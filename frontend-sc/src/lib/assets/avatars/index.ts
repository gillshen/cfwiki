import Bear from './bear.png';
import Bunny from './bunny.png';
import Camel from './camel.png';
import Chick from './chick.png';
import Cow from './cow.png';
import Dolphin from './dolphin.png';
import Elephant from './elephant.png';
import Fish from './fish.png';
import Ghost from './ghost.png';
import Horse from './horse.png';
import Kitty from './kitty.png';
import Koala from './koala.png';
import Monster from './monster.png';
import Monster2 from './monster2.png';
import Octopus from './octopus.png';
import Penguin from './penguin.png';
import Porcupine from './porcupine.png';
import PufferFish from './puffer-fish.png';
import Rat from './rat.png';
import Shell from './shell.png';
import Snail from './snail.png';
import Snake from './snake.png';
import Tiger from './tiger.png';
import Whale from './whale.png';

export const avatars = {
	Bear,
	Bunny,
	Camel,
	Chick,
	Cow,
	Dolphin,
	Elephant,
	Fish,
	Ghost,
	Horse,
	Kitty,
	Koala,
	Monster,
	Monster2,
	Penguin,
	Porcupine,
	PufferFish,
	Rat,
	Shell,
	Snail,
	Snake,
	Octopus,
	Tiger,
	Whale
} as const;

export const randomAvatar = (fromArray: string[] = []) => {
	const avatarsArray = fromArray.length
		? fromArray
		: Object.entries(avatars).map((entry) => entry[1]);
	return avatarsArray[Math.floor(Math.random() * avatarsArray.length)];
};
