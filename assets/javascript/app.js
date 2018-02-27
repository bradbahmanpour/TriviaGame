//  This code will run as soon as the page loads.

var count = 60;
var corrAnswerArr = [];
var totalCorrectAnswer = 0;
var totalWrongAnswer = 0;
var totalUnanswered = 0;
var intervalId = 0;

window.onload = function () {

  //  Click events are done for us:
  $("#start").click(startTheGame);
  $("#getAnswersBut").click(displayResults);
  $("#newGameBut").click(startTheGame);

};

function shuffle(arra1) {
  let ctr = arra1.length;
  let temp;
  let index;

  // While there are elements in the array
  while (ctr > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * ctr);
    // Decrease ctr by 1
    ctr--;
    // And swap the last element with it
    temp = arra1[ctr];
    arra1[ctr] = arra1[index];
    arra1[index] = temp;
  }
  return arra1;
}

function startTheGame() {

  var queryURL = "https://opentdb.com/api.php?amount=20";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    createRow(response);
  });

  startTimer();

}

function findAnswers() {

  totalCorrectAnswer = 0;
  totalWrongAnswer = 0;
  totalUnanswered = 0;

  console.log(corrAnswerArr);
  for (i = 0; i < 10; i++) {
    var thisQuestion = "trivia" + i;
    // console.log("thisQuestion = " + "'" + thisQuestion + "'");
    var userAnswer = $("input[name=" + "'" + thisQuestion + "'" + "]:checked").val();
    //  console.log("userAnswer = " + userAnswer);

    // Find out the number of Correct Answers

    console.log("corrAnswerArr[" + i + "] = " + corrAnswerArr[i]);
    if (userAnswer == corrAnswerArr[i]) {
      totalCorrectAnswer++;
      //   console.log("totalCorrectAnswer = " + totalCorrectAnswer);
    } else if (userAnswer == null) {
      totalUnanswered++;
      //   console.log("totalUnanswered = " + totalUnanswered);
    } else if ((userAnswer != null) && (userAnswer != corrAnswerArr[i])) {
      totalWrongAnswer++;
      //   console.log("totalWrongAnswer = " + totalWrongAnswer);
    }
  }

  console.log("totalCorrectAnswer = " + totalCorrectAnswer);
  console.log("totalWrongAnswer = " + totalWrongAnswer);
  console.log("totalUnanswered = " + totalUnanswered);

}


// This function will replace display whatever image it's given
// in the 'src' attribute of the img tag.
function displayTime() {
  $("#image-holder").html("<img src=" + images[count] + " width='400px'>");
}


function displayResults() {
  findAnswers();
  stopTheGame();
  window.location.href = "#bot";
  $("#totalCorrect").html(totalCorrectAnswer);
  $("#totalIncorrect").html(totalWrongAnswer);
  $("#totalunanswered").html(totalUnanswered);
}

function remainingTime() {
  // Decrease the count by 1.
  count--;
  var h2 = $("<h2>");
  h2.text(count);
  $("#timeLeft").html(h2);

  // $("#image-holder").html("<img  src='images/loading.gif' width='400px'>");
  // TODO: Use a setTimeout to run displayImage after 1 second.
  // setTimeout(displayTime, 1000);

  if (count === 0) {
    displayResults();
  }
}

function startTimer() {
  count = 60;
  totalCorrectAnswer = 0;
  totalWrongAnswer = 0;
  totalUnanswered = 0;

  intervalId = setInterval(remainingTime, 1000);
  window.location.href = "#center";
}

function stopTheGame() {
  clearInterval(intervalId);
}



// The createRow function takes data returned by OMDB and appends the table data to the tbody
var createRow = function (data) {

  console.log("I am in Create Row function");
  console.log(data);
  var qNum = 0;
  var displayedNum = 0;
  $('#trivial').empty();
  corrAnswerArr = [];
  var allAnswers = [];

  for (var qNum = 0; qNum < 20; qNum++) {

    var questionType = data.results[qNum].type;

    if (questionType === "multiple" && displayedNum < 10) {
      var questions = data.results[qNum].question;
      var correctAnswer = data.results[qNum].correct_answer;



      console.log("displayedNum " + displayedNum);
      console.log(questions);
      console.log(correctAnswer);
      // Adding Correct Answers to "corrAnswer" array
      corrAnswerArr.push(correctAnswer);


      var answers = [];
      for (var j = 0; j < 3; j++) {
        var incorrectAnswer = data.results[qNum].incorrect_answers[j];
        answers.push(incorrectAnswer);
        //   console.log("Incorrect Answer "+j+" is " + incorrectAnswer);    
      }
      console.log("Incorrect answer array is " + answers);
      //tRow.append(questions);
      $('#trivial').append("<div></div>");
      $('#trivial').append("<h3>" + questions);
      $('#trivial').append("</h3>");

      answers.push(correctAnswer);
      console.log(answers);

      // Shuffle All the answers first and then display
      allAnswers = (shuffle(answers));

      for (var x = 0; x < answers.length; x++) {
        $('#trivial').append($('<div class="col-md-3">' + '<label><input type="radio" name="' + "trivia" + displayedNum + '"value="' + allAnswers[x] + '" >' + allAnswers[x] + '</label></div>'));

      }

      displayedNum++;

    }
  }

}

