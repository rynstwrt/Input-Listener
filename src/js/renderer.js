const startStopButton = document.querySelector("#start-stop-button");

const API_NAME = "listenToAudioInputAPI";
let isListening = false;
let startText = stopText = "";


startStopButton.addEventListener("click", () =>
{
    if (isListening)
    {
        isListening = false;
        startStopButton.textContent = startText;
    }
    else
    {
        isListening = true;
        startStopButton.textContent = stopText;
    }
});


(async () =>
{
    [startText, stopText] = await window[API_NAME].getStartStopText();
    startStopButton.textContent = startText;
})();