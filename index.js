let convert = document.getElementById("convert");
let box = document.getElementById('box');
let control = document.getElementById('control');
let textContent = "";
let isPaused = false;

let play = document.createElement("button")
play.id = "play"

play.innerHTML = '<i class="fa-solid fa-play"></i>'

let pause = document.createElement("button")
pause.id = "pause"

pause.innerHTML = '<i class="fa-solid fa-pause"></i>'

let restart = document.createElement("button")
restart.id = "restart"

restart.innerHTML = '<i class="fa-solid fa-rotate-right"></i>'


convert.onclick = function(){
    control.appendChild(play);
    control.appendChild(pause);
    control.appendChild(restart);
}




convert.addEventListener("click", function () {
    let fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            const typedArray = new Uint8Array(this.result);
            pdfjsLib.getDocument(typedArray).promise.then(pdf => {
                
                let promises = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    promises.push(pdf.getPage(i).then(page => 
                        page.getTextContent().then(text => {
                            textContent += text.items.map(item => item.str).join(" ") + "\n\n";
                        })
                    ));
                }
                // Promise.all(promises).then(() => {
                //     document.getElementById("output").textContent = textContent;
                // });
            });
        };
        reader.readAsArrayBuffer(file);
    }
});

const synth = window.speechSynthesis;
play.onclick = function play(){
    resumeSpeech()
    function resumeSpeech() {
        if (synth.speaking != false) {
            synth.resume();
        }
    }
    const voices = synth.getVoices();
    const utterance = new SpeechSynthesisUtterance(textContent);    // Set voice and properties
    // Set voice and properties
    const selectedVoice = voices.find(voice => voice.name.includes("Google UK English Male")) ||
                                    voices.find(voice => voice.name.includes("Alex")) ||
                                    voices.find(voice => voice.name.includes("Microsoft Mark"));
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    } // Adjust rate

    // Speak the text
    synth.speak(utterance);


}
pause.onclick = function() {
    if (synth.speaking) {
        synth.pause();
    }
}
restart.onclick = function(){
    synth.cancel();
    const voices = synth.getVoices();
    const utterance = new SpeechSynthesisUtterance(textContent);    // Set voice and properties
    // Set voice and properties
    const selectedVoice = voices.find(voice => voice.name.includes("Google UK English Male")) ||
                                    voices.find(voice => voice.name.includes("Alex")) ||
                                    voices.find(voice => voice.name.includes("Microsoft Mark"));
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    } // Adjust rate

    // Speak the text
    synth.speak(utterance);
}

synth.onvoiceschanged = setVoice;