//Api URL
const ApiUrl = "https://api.quotable.io/random?minLength=170&maxLength=190";
const paragraphArea = document.getElementById("paragraph");
const userInput = document.getElementById("paragraph-input");
let paragraph = "";
let time = 60;
let timer = "";
let errors = 0;

//Generate random paragraphs
const generateNewParagraph = async () => {
  //Fetch contents from url
  const response = await fetch(ApiUrl);

  //Store response
  let data = await response.json();

  //Access paragraph
  paragraph = data.content;

  //Array of characters in the paragraph
  let arr = paragraph.split("").map((value) => {
    //wrap the characters in a span tag
    return "<span class='paragraph-chars'>" + value + "</span>";
  });
  //join array for displaying
  paragraphArea.innerHTML += arr.join("");
};

//comparing words input with paragraph
userInput.addEventListener("input", () => {
  let paragraphChars = document.querySelectorAll(".paragraph-chars");
  //Create an array from span tags
  paragraphChars = Array.from(paragraphChars);

  //split user input characters
  let userInputChars = userInput.value.split("");

  //loop through each character in paragraph
  paragraphChars.forEach((char, index) => {
    //Check if char(paragraph character) = userInputChars[index](input character)
    if (char.innerText == userInputChars[index]) {
      char.classList.add("correct");
    }
    //If user hasn't entered anything or backspaced
    else if (userInputChars[index] == null) {
      //Remove class if any
      if (char.classList.contains("correct")) {
        char.classList.remove("correct");
      } else {
        char.classList.remove("incorrect");
      }
    }
    //If user entered incorrect character
    else {
      //Checks if we already have added incorrect class
      if (!char.classList.contains("incorrect")) {
        //increment by 1 and display errors
        errors += 1;
        char.classList.add("incorrect");
      }
      document.getElementById("errors").innerText = errors;
    }
    //Returns true if all the characters are entered correctly
    let check = paragraphChars.every((element) => {
      return element.classList.contains("correct");
    });
    //End test if all characters are correct
    if (check) {
      displayResult();
    }
  });
});

//Update Timer on screen
function updateTimer() {
  if (time == 0) {
    //End test if timer reaches 0
    displayResult();
  } else {
    document.getElementById("timer").innerText = --time + "s";
  }
}

//Sets timer
const setTime = () => {
  time = 60;
  timer = setInterval(updateTimer, 1000);
};

//End Test
const displayResult = () => {
  //display result div
  document.querySelector(".results").style.display = "block";
  document.getElementById("retry").style.display = "block";
  clearInterval(timer);
  document.getElementById("stop-test").style.display = "none";
  document.getElementById("instructions").style.display = "none";

  userInput.disabled = true;
  let timeTaken = 1;
  if (time != 0) {
    timeTaken = (60 - time) / 100;
  }
  document.getElementById("wpm").innerText =
    (userInput.value.length / 5 / timeTaken).toFixed(0) + " wpm";
  document.getElementById("accuracy").innerText =
    Math.round(
      ((userInput.value.length - errors) / userInput.value.length) * 100
    ) + " %";
};

//Start Test
const startTest = () => {
  errors = 0;
  timer = "";
  userInput.disabled = false;
  setTime();
  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";
  document.getElementById("retry").style.display = "none";
  document.getElementById("instructions").style.display = "none";
};

window.onload = () => {
  userInput.value = "";
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  document.getElementById("retry").style.display = "none";

  userInput.disabled = true;
  generateNewParagraph();
};
