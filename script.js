const button = document.getElementById('button');
const audioElement = document.getElementById('audio');

// Disable enable button
function toggleButton() {
    button.disabled = !button.disabled;
}

// Passing joke to voice API
function tellJokeAPI(joke) {
    const jokeString = joke.trim().replace(/ /g, '%20');
    // VoiceRSS Speech Parameters
    VoiceRSS.speech({
        key: 'e985f868e96c46d9b0789c3855350152',
        src: jokeString,
        hl: 'en-us',
        r: 0,
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false,
    });
}

// Text-To-Speech browser API
function tellJoke(joke) {
    if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance();
        msg.text = joke;
        window.speechSynthesis.speak(msg);
        msg.addEventListener('end', toggleButton);
    } else {
        // Speech synthesis is not supported
        tellJokeAPI(joke);
    }
}

// Get jokes from joke API
async function getJokes() {
    let joke = ''
    const jokeType = 'Programming'; // Any or Programming
    const apiUrl = `https://v2.jokeapi.dev/joke/${jokeType}?blacklistFlags=racist,sexist`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        // Assign one or two part joke
        if (data.setup) {
            joke = `${data.setup} ... ${data.delivery}`;
        } else {
            joke = data.joke;
        }
        // Passing Joke to browser API or VoiceRSS API
        tellJoke(joke);
        // Disable button
        toggleButton();
    } catch (error) {
        // Catch errors here
    }
}

// Event listeners
button.addEventListener('click', getJokes);
audioElement.addEventListener('ended', toggleButton);
