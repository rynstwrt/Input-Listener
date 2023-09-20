const startStopButton = document.querySelector("#start-stop-button");

const audioInputDeviceSelect = document.querySelector("#audio-input-device-select");
const audioOutputDeviceSelect = document.querySelector("#audio-output-device-select");

const API_NAME = "listenToAudioInputAPI";
let isListening = false;
let startText = stopText = "";
const inputDeviceMap = new Map(),
    outputDeviceMap = new Map();


startStopButton.addEventListener("click", () =>
{
    isListening = !isListening;
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
        option.textContent = device.label;

        const targetSelect = isAudioInput ? audioInputDeviceSelect : audioOutputDeviceSelect;
        targetSelect.appendChild(option);
    }
}


(async () =>
{
    [startText, stopText] = await window[API_NAME].getStartStopText();
    startStopButton.textContent = startText;

    await createAudioDeviceOptions();
})();