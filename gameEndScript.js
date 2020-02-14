var finalScore = localStorage.getItem("finalScore");

var usedWordsString = localStorage.getItem("usedWords");
console.log(usedWordsString);
var usedWords = usedWordsString.split(",");
var numWords = usedWords.length;
var numRows = numWords / 2;

var table = document.getElementById("wordsTable");
var defWordDisplay = document.getElementById("defWord");
var defTextDisplay = document.getElementById("defText");
var scoreDisplay = document.getElementById("score");

var defText;

for (i = 0; i < numRows; i++) {
  var currRow = document.getElementById("wordsRow" + i);
  if (currRow) {
    for (j = 0; j < 2; j++) {
      var currWord = document.getElementById("word" + i + "_" + j)
      currWord.innerHTML = usedWords[0];
      usedWords.shift();
    }
  } else {
    var newRow = table.insertRow(i);
    newRow.className = "wordsRow";
    var newWord1 = newRow.insertCell(0);
    var newWord2 = newRow.insertCell(1);
    newWord1.className = newWord2.className = "word";
    newWord1.innerHTML = usedWords[0];
    newWord2.innerHTML = usedWords[1];
    usedWords.splice(0, 2);
  }
}

$(".word").click(function() {
  var word = this.textContent;
  defWordDisplay.innerHTML = word;
  defTextDisplay.innerHTML = "";
  $.ajax({
    type: "GET",
    url: "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=058036c9-eb04-4c41-b4b8-72de22609d84",
    dataType: 'json',
    success: function(data) {
      for (i = 0; i < data.length; i++) {
        var currDef = data[i].shortdef + "<br><br>";
        defTextDisplay.innerHTML += (i + 1) + " " + currDef;
      }
    },
    async: false
  });
})

scoreDisplay.innerHTML = finalScore;