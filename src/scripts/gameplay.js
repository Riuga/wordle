export default function playGame(lang) {
	const keys = document.getElementsByClassName("key");
	const attempts = [[]];
	const state = [];
	let row = 0;
	let data;
	getData(lang)
		.then((response) => (data = response))
		.catch((err) => console.error(err));

	// listening key press
	for (let i = 0; i < keys.length; i++) {
		keys[i].onclick = ({ target }) => {
			const letter = target.getAttribute("data-key");
			if (row < 6) {
				if (letter === ">>") {
					if (attempts[row].length === 5) {
						state.push(check(attempts[row], data.word.split("")));
						row++;
						attempts.push([]);
						console.log(state);
					}
				} else if (letter === "backspace") {
					attempts[row].pop();
					draw(attempts[row], row);
				} else if (attempts[row].length < 5) {
					attempts[row].push(letter);
					draw(attempts[row], row);
				}
			}
		};
	}
}

function draw(word, row) {
	let child;
	let filledWord = word.slice();
	while (filledWord.length < 5) {
		filledWord.push("");
	}
	const wordsOnBoard = document.querySelectorAll(".word");

	for (let i = 0; i < filledWord.length; i++) {
		child = wordsOnBoard[row].children[i];
		child.innerHTML = filledWord[i];
	}
}

async function getData(lang) {
	const options = { method: "POST" };
	const response = await fetch(
		`https://wordle.kheynov.ru/api/word/get?lang=${lang}`,
		options
	);
	const data = await response.json();
	return await data;
}

function check(guess, correct) {
	const attempt = guess.slice();
	const word = correct.slice();
	const state = ["", "", "", "", ""];
	for (let i = 0; i < 5; i++) {
		if (attempt[i] === word[i]) {
			state[i] = "X";
			attempt[i] = "";
			word[i] = "";
		}
	}

	for (let i = 0; i < 5; i++) {
		let index = word.findIndex(char => char === attempt[i]);
		if (attempt[i] !== "" && index !== -1) {
			word[index] = "";
			attempt[i] = "";
			state[i] = "C";
		}
	}

	state.forEach((el) => {
		if (el === "") {
			el = "M";
		}
	});

	return state;
}
