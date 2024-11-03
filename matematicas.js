const riddles = [
    {
        question: "I am a data input and output device, and I usually have buttons and a display. Who am I?",
        answer: "keyboard",
        options: ["monitor", "keyboard", "mouse"],
        image: "imagenes/teclado.jpg"
    },
    {
        question: "I contain all kinds of information, from images to documents, and you can connect me via USB. Who am I?",
        answer: "pendrive",
        options: ["hard disk", "pendrive", "printer"],
        image: "imagenes/pendrive.jpg"
    },
    {
        question: "My job is to protect you from viruses and computer threats. Who am I?",
        answer: "anti-virus",
        options: ["firewall", "anti-virus", "browser"],
        image: "imagenes/familia.jpg"
    },
    {
        question: "I am the brain of the computer and I do all the calculations. Who am I?",
        answer: "processor",
        options: ["processor", "RAM memory", "hard disk"],
        image: "imagenes/procesa.jpg"
    },
    {
        question: "You use me to access the Internet, but I am not the Internet. Who am I?",
        answer: "browser",
        options: ["modem", "browser", "firewall"],
        image: "imagenes/internet.jpg"
    }
];

let currentRiddleIndex = 0;

function showRiddle() {
    const currentRiddle = riddles[currentRiddleIndex];

    const imageElement = document.getElementById("questionImage");
    imageElement.src = currentRiddle.image;
    imageElement.style.display = "block"; // Asegura que la imagen esté visible
    
    // Muestra la pregunta
    document.getElementById("question").textContent = currentRiddle.question;

    // Muestra las opciones como botones de radio
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = ""; // Limpia las opciones previas
    currentRiddle.options.forEach(option => {
        const optionElement = document.createElement("div");
        optionElement.innerHTML = `
            <input type="radio" name="option" value="${option}">
            <label>${option}</label>
        `;
        optionsContainer.appendChild(optionElement);
    });

    // Limpia mensaje y respuesta anterior
    document.getElementById("message").textContent = "";
    document.getElementById("restartButton").style.display = "none";
}

function checkAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (!selectedOption) {
        document.getElementById("message").textContent = "Please select an answer.";
        return;
    }

    const userAnswer = selectedOption.value;
    const correctAnswer = riddles[currentRiddleIndex].answer;

    if (userAnswer === correctAnswer) {
        currentRiddleIndex++;
        if (currentRiddleIndex < riddles.length) {
            showRiddle();
        } else {
            document.getElementById("message").textContent = "Congratulations! You have answered all the riddles correctly.";
            document.getElementById("restartButton").style.display = "block";
        }
    } else {
        document.getElementById("message").textContent = "Wrong answer, you lost the game!";
        document.getElementById("restartButton").style.display = "block";
    }
}

function restartGame() {
    currentRiddleIndex = 0;
    showRiddle();
}

// Iniciar el primer enigma
showRiddle();
