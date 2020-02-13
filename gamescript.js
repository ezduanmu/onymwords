    var words = ["POLITE","BEAUTIFUL", "GORGEOUS", "HAPPY", "SAD", "UGLY",
                "UNHAPPY", "UNATTRACTIVE", "ATTRACTIVE", "HANDSOME", "CUTE",
                "SMART", "STUPID", "BIG", "TINY", "HUGE", "LUCKY", "UNLUCKY",
                "FUN", "FUNNY", "SCARY", "DUMB", "DIFFICULT", "EASY", "PLEASANT",
                "EXCITED", "PATHETIC", "HONORABLE", "INCORRECT", "MANY",
                "WORSE", "SUPERIOR", "ELEGANT", "SIMPLE", "LOUD", "QUIET", "PROPER",
                "SECURE", "HORRIBLE", "DISGUSTING", "SMOOTH", "HEALTHY", "RESPONSIBLE",
              "ACTIVE", "PASSIVE", "TERRIBLE", "STIFF", "FAT", "SKINNY", "BORING"];
    var usedWords = [];
    var word1 = document.getElementById("word1");
    var word2 = document.getElementById("word2");
    var ansId;
    var currScore = 0;
    var finalScore = 0;
    var currLives;
    var synDisplay = document.getElementById("synonyms");
    var antDisplay = document.getElementById("antonyms");
    var neiDisplay = document.getElementById("neither");
    var progressBar = document.getElementById("time");
    var feedbackDisplay = document.getElementById("feedback");
    var w1choose = "";
    var w2choose = "";
    var correctAnswer = "NEITHER";
    var intervalTimer;

    function setWords() {
        document.getElementById("feedback").innerHTML = "";
        do {
          $.ajax({
            type: "GET",
            url: "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/"+words[Math.floor(Math.random() * words.length)]+"?key=22b1d144-e9b9-42dc-aa2f-cea2b942e8d6",
            dataType: 'json',
            success: function(data) {
              w1choose = data[0].meta.syns[0][Math.floor(Math.random() * data[0].meta.syns[0].length)].toUpperCase();
            },
            async: false
          });
        } while (usedWords.includes(w1choose));
        var pick = Math.floor(Math.random() * 11) + 1;
        do {
          choosew2(w1choose, pick);
        } while (usedWords.includes(w2choose));
        usedWords.push(w1choose, w2choose);
        word1.innerHTML = w1choose;
        word2.innerHTML = w2choose;
        console.log("correctAnswer: " + correctAnswer);
        timing();
      }

      function choosew2(w1choose, pick) {
        do {
          if (pick < 5) {                                                      // 4/11 chance of synonym
            if (synsExist(w1choose)) {
              w2choose = pickSynonym(w1choose);
              correctAnswer = "SYNONYMS";
            } else {
              pick = 3;
            }
          }
          if (pick >= 5 && pick < 9) {                                         // 4/11 chance of antonym
            if (antsExist(w1choose)) {
              w2choose = pickAntonym(w1choose);
              correctAnswer = "ANTONYMS";
            } else {
              pick = 3;
            }
          }
          if (pick >= 9) {                                                     // 3/11 chance of neither (less meaningful and slightly slower to run)
            correctAnswer = "NEITHER";
            w2choose = pickRandom();
            if (areSynonyms(w1choose, w2choose)) {
              correctAnswer = "SYNONYMS";
            }
            if (areAntonyms(w1choose, w2choose)) {
              correctAnswer = "ANTONYMS";
            }
          }
          if ((w2choose == "undefined") || (w2choose == "")) {
            w2choose = pickRandom(w1choose);
          }
        } while (w1choose == w2choose);
      }

      function synsExist(w) {
        var b = false;
        $.ajax({
          type: "GET",
          url: "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/"+w+"?key="+"22b1d144-e9b9-42dc-aa2f-cea2b942e8d6",
          dataType: 'json',
          success: function(data) {
            if (data[0].meta.hasOwnProperty("syns")) {
              if (data[0].meta.syns.status === undefined) {
                if (data[0].meta.syns.length > 0) {
                  b = true;
                }
              }
            }
          },
          async: false
        });
        return b;
      }

      function antsExist(w) {
        var b = false;
        $.ajax({
          type: "GET",
          url: "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/"+w+"?key="+"22b1d144-e9b9-42dc-aa2f-cea2b942e8d6",
          dataType: 'json',
          success: function(data) {
            if (data[0].meta.hasOwnProperty("ants")) {
              if (data[0].meta.ants.status === undefined) {
                if (data[0].meta.ants.length > 0) {
                  b = true;
                }
              }
            }
          },
          async: false
        });
        return b;
      }

      function pickSynonym(w) {
        var s;
        $.ajax({
          type: "GET",
          url: "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/"+w+"?key=22b1d144-e9b9-42dc-aa2f-cea2b942e8d6",
          dataType: 'json',
          success: function(data) {
            outerArray = data[0].meta.syns[Math.floor(Math.random() * data[0].meta.syns.length)];
            s = outerArray[Math.floor(Math.random() * outerArray.length)];
            //s = JSON.stringify(data[0].meta.syns[0][Math.floor(Math.random() * data[0].meta.syns[0].length)]);
          },
          async: false
        });
        return s.toUpperCase().replace(/\"/g, "");
      }

      function pickAntonym(w) {
        var a;
        $.ajax({
          type: "GET",
          url: "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/"+w+"?key=22b1d144-e9b9-42dc-aa2f-cea2b942e8d6",
          dataType: 'json',
          success: function(data) {
            outerArray = data[0].meta.ants[Math.floor(Math.random() * data[0].meta.ants.length)];
            a = outerArray[Math.floor(Math.random() * outerArray.length)];
            //s = JSON.stringify(data[0].meta.syns[0][Math.floor(Math.random() * data[0].meta.syns[0].length)]);
          },
          async: false
        });
        return a.toUpperCase().replace(/\"/g, "");
      }

      function pickRandom() {
        var n;
        $.ajax({
          type: "GET",
          url: "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/"+words[Math.floor(Math.random() * words.length)]+"?key=22b1d144-e9b9-42dc-aa2f-cea2b942e8d6",
          dataType: 'json',
          success: function(data) {
            which = Math.floor(Math.random() * 2) + 1;
            if (which == 1) {
              outerArray = data[0].meta.syns[Math.floor(Math.random() * data[0].meta.syns.length)];
              n = outerArray[Math.floor(Math.random() * outerArray.length)];
            }
            else {
              outerArray = data[0].meta.ants[Math.floor(Math.random() * data[0].meta.ants.length)];
              n = outerArray[Math.floor(Math.random() * outerArray.length)];
            }
          },
          async: false
        });
        return n.toUpperCase().replace(/\"/g, "");
      }

    setWords();

    function answer(ans) {
      console.log(usedWords);
      ansId = ans;
      var done = false;
      $("#"+correctAnswer.toLowerCase()).addClass("correctButton");
      synDisplay.disabled = antDisplay.disabled = neiDisplay.disabled = true;
      $("#synonyms").removeClass("answerButton_hover");
      $("#antonyms").removeClass("answerButton_hover");
      $("#neither").removeClass("answerButton_hover");
      if (ansId == "timesUp") {
        currLives = parseInt(document.getElementById("lives").textContent);
        currLives--;
        if (currLives > 0) {
          $('#feedback').html('⏳❌').show().delay(700).fadeOut(350);
          document.getElementById("lives").innerHTML = currLives;
          $.when($('#feedback').show()).then(function() { next(); });
        }
        else {
          feedbackDisplay.style.color = "#d90024";
          $('#feedback').html('❌ GAME OVER ❌').show();
          document.getElementById("lives").innerHTML = 0;
          finalScore = parseInt(document.getElementById("currentScore").textContent);
          $.when($('#feedback').show()).then(gameEnd());
        }
      }
      else if (ansId == correctAnswer.toLowerCase()) {
        var gainedScore = Math.round(progressBar.value * 100);
        $("#" + ansId).addClass("correctButton");
        feedbackDisplay.style.color = "#14b000";
        $('#feedback').html("+" + gainedScore).show().delay(700).fadeOut(350);
        currScore = parseInt(document.getElementById("currentScore").textContent);
        currScore += gainedScore;
        var newScore = (currScore).toString();
        document.getElementById("currentScore").innerHTML = newScore;
        $.when($('#feedback').show()).then(function() { next(); });
      }
      else {
        $("#" + ansId).addClass("wrongButton");
        currLives = parseInt(document.getElementById("lives").textContent);
        currLives--;
        if (currLives > 0) {
          $('#feedback').html('👎❌').show().delay(700).fadeOut(350);                                           // More than 0 lives, keep playing
          document.getElementById("lives").innerHTML = currLives;
          $.when($('#feedback').show()).then(function() { next(); });
        }
        else {
          feedbackDisplay.style.color = "#d90024";
          $('#feedback').html('❌ GAME OVER ❌').show();
          document.getElementById("lives").innerHTML = 0;
          finalScore = parseInt(document.getElementById("currentScore").textContent);
          $.when($('#feedback').show()).then(gameEnd());
        }
      }
    }

    function next() {
      $("#" + ansId).removeClass("wrongButton");                                 // Hide feedback
      $("#" + ansId).removeClass("correctButton");                               // Hide feedback
      $("#synonyms").addClass("answerButton_hover");                         // Allow hover on answerButtons
      $("#antonyms").addClass("answerButton_hover");                         // Allow hover on answerButtons
      $("#neither").addClass("answerButton_hover");                          // Allow hover on answerButtons
      synDisplay.disabled = antDisplay.disabled = neiDisplay.disabled = false;                                           // answerButtons clickable again
      $("#" + correctAnswer.toLowerCase()).removeClass("correctButton");
      setWords();
    }

    function areAntonyms(w1, w2) {
      var isAntonym = false;
      w1 = w1.toLowerCase();
      w2 = w2.toLowerCase();
      $.ajax({
        type: "GET",
        url: "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/"+w1+"?key=22b1d144-e9b9-42dc-aa2f-cea2b942e8d6",
        dataType: 'json',
        success: function(data) {
          if (data[0].meta.ants.length > 0) {
            for (i = 0; i < data[0].meta.ants.length; i++) {
              if (data[0].meta.ants[i].includes(w2)) {
                isAntonym = true;
              }
            }
          }
        },
        async: false
      });
      $.ajax({
        type: "GET",
        url: "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/"+w2+"?key=22b1d144-e9b9-42dc-aa2f-cea2b942e8d6",
        dataType: 'json',
        success: function(data) {
          if (data[0].meta.ants.length > 0) {
            for (i = 0; i < data[0].meta.ants.length; i++) {
              if (data[0].meta.ants[i].includes(w1)) {
                isAntonym = true;
              }
            }
          }
        },
        async: false
      });
      return isAntonym;
    }

    function areSynonyms(w1, w2) {
      var isSynonym = false;
      w1 = w1.toLowerCase();
      w2 = w2.toLowerCase();
      $.ajax({
        type: "GET",
        url: "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/"+w1+"?key=22b1d144-e9b9-42dc-aa2f-cea2b942e8d6",
        dataType: 'json',
        success: function(data) {
          if (data[0].meta.syns.length > 0) {
            for (i = 0; i < data[0].meta.syns.length; i++) {
              if (data[0].meta.syns[i].includes(w2)) {
                isSynonym = true;
              }
            }
          }
        },
        async: false
      });
      $.ajax({
        type: "GET",
        url: "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/"+w2+"?key=22b1d144-e9b9-42dc-aa2f-cea2b942e8d6",
        dataType: 'json',
        success: function(data) {
          if (data[0].meta.syns.length > 0) {
            for (i = 0; i < data[0].meta.syns.length; i++) {
              if (data[0].meta.syns[i].includes(w1)) {
                isSynonym = true;
              }
            }
          }
        },
        async: false
      });
      return isSynonym;
    }

    function timing() {
      var timeLeft = 10;
      progressBar.setAttribute("min", "0");
      intervalTimer = setInterval(function() {
        progressBar.value = timeLeft;
        timeLeft -= 0.01;
        if (timeLeft <= 0) {
          clearInterval(intervalTimer);
          answer("timesUp");
        }
      }, 10);
      $(".answerButton").click(
        function() {
          clearInterval(intervalTimer);
        }
      )
    }

    function gameEnd() {
      localStorage.setItem("finalScore", finalScore);
      localStorage.setItem("usedWords", usedWords);
      setTimeout(function() { window.location.href = "gameEnd.html" }, 2750);
    }
