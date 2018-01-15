document.querySelector('body').addEventListener('keyup', function (e) {
    if (e.key === "o") {
        responsiveVoice.setDefaultVoice("French Female");
        console.log(responsiveVoice);
        responsiveVoice.speak("hello world lel", "French Female", {pitch: 2});
    }
})