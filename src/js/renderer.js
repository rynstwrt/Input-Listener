const startStopButton = document.querySelector("#start-stop-button");

const audioInputDeviceSelect = document.querySelector("#audio-input-device-select");
const audioOutputDeviceSelect = document.querySelector("#audio-output-device-select");

const API_NAME = "listenToAudioInputAPI";

let isListening = false;

let startText = stopText = "";

const inputDeviceMap = new Map(),
    outputDeviceMap = new Map();

let currentInputDeviceID = "default";
let currentOutputDeviceID = "default";

let audio;
let stream;


async function play()
{
    stream = await navigator.mediaDevices.getUserMedia({
        audio: {
            deviceId: { exact: currentInputDeviceID },
            noiseSuppression: false,
            echoCancellation: false
        },
        video: false
    });

    audio = new Audio();
    audio.srcObject = stream;
    await audio.play();
}


function stop()
{
    stream.getTracks().forEach(track =>
    {
        if (track.readyState === 'live' && track.kind === 'audio')
            track.stop();
    });

    audio = stream = undefined;
}


startStopButton.addEventListener("click", () =>
{
    isListening = !isListening;

    isListening ? play() : stop();
    startStopButton.textContent = (isListening ? stopText : startText);
});


async function createAudioDeviceOptions()
{
    const devices = await navigator.mediaDevices.enumerateDevices();

    for (let i = 0; i < devices.length; ++i)
    {
        const device = devices[i];

        const isAudioInput = (device.kind === "audioinput");
        const isAudioOutput = (device.kind === "audiooutput");

        if (!isAudioInput && !isAudioOutput)
            continue;

        const targetMap = isAudioInput ? inputDeviceMap : outputDeviceMap;
        targetMap.set(device.label, device.deviceId);

        const option = document.createElement("option");
        option.value = option.textContent = device.label;

        const targetSelect = isAudioInput ? audioInputDeviceSelect : audioOutputDeviceSelect;
        targetSelect.appendChild(option);
    }

    console.log(currentInputDeviceID, currentOutputDeviceID);
}


[audioInputDeviceSelect, audioOutputDeviceSelect].forEach((select) =>
{
    const isInput = select === audioInputDeviceSelect;

    select.addEventListener("change", async () =>
    {
        const label = select.value;
        const id = isInput ? inputDeviceMap.get(label) : outputDeviceMap.get(label);

        isInput ? currentInputDeviceID = id : currentOutputDeviceID = id;

        stop();
        await play();

        console.log(currentInputDeviceID, currentOutputDeviceID);
    });
});


(async () =>
{
    [startText, stopText] = await window[API_NAME].getStartStopText();
    startStopButton.textContent = startText;

    await createAudioDeviceOptions();
})();