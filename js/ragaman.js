// constants
CONSONANTS = "ttttttnnnnsssshhhrrrdddlllccmwfgypbvkjxqz";
VOWELS = "eeeeeeeaaaaaoooiii";
ALPHABET = "abcdefghijklmnopqrstuvwxyz";
PRESSURE = ["#000000", "#003322", "#005544", "#008866", "#00aa88", "#00ddaa", "#00eebb"];
SPACE = 32;
ENTER = 13;
BACKSPACE = 8;

function init() {
    dom_input.style.fontSize = "70pt";
    pool = "";
    possible_words = null;
    game_over = false;
    current_guess = "";
    score = 0;
    already_guessed = [];
    timeleft = 5;
    pool = CONSONANTS.shuffle().substring(0,4) + VOWELS.shuffle().substring(0,3);
    pool_left = pool;
    dom_pool.innerText = pool;
    dom_already_guessed.innerText = "";
    second(timeleft);
    timer = window.setInterval(function() {second();}, 1000);
    dom_pool.innerText = pool;
    dom_input.innerText = "";
    pressure(0);
}

function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}

document.onkeydown = function(e) {
    var key = e.keyCode;
    if (game_over) {
        if (key == SPACE) {
            document.getElementById("main").style.display = "block";
            document.getElementById("scores").style.display = "none";
            init();
        } else {
            return;
        }
    }
    current_guess = input.innerText;
    if (key == ENTER) {
        // submit
        if (already_guessed.indexOf(current_guess) === -1 && current_guess.length > 0 && checkWord(current_guess)) {
            score += current_guess.length * current_guess.length;
            already_guessed.push(current_guess);
            var guess_span = document.createElement("span");
            guess_span.innerText += current_guess + " ";
            guess_span.style.color = PRESSURE[current_guess.length-1];
            dom_already_guessed.appendChild(guess_span);
        }
        pool += current_guess;
        current_guess = "";
        pressure(0);
    } else if (key == BACKSPACE && input.innerText.length > 0) {
        // delete
        pool += current_guess.substr(current_guess.length-1);
        current_guess = current_guess.substr(0,current_guess.length-1);
        pressure(current_guess.length);
    } else if (key == SPACE) {
        // shuffle
        e.preventDefault();
        pool = pool.shuffle();
    } else {
        var character = String.fromCharCode(e.keyCode).toLowerCase();
        var index = pool.indexOf(character);
        if (index != -1) {
            // input
            pressure(current_guess.length);
            current_guess += character;
            pool = pool.substring(0,index) + pool.substring(1+index);
        }
    }
    dom_pool.innerText = pool;
    dom_input.innerText = current_guess;
    dom_score.innerText = "Score: " + score + "\n" + "Time left: " + timeleft;
};

function checkWord(word) {
    return all_words.indexOf(word) != -1;
}

function pressure(level) {
    dom_input.style.color = PRESSURE[level];
}


function second() {
    if (timeleft == 0) {
        // game over
        // rebuild pool in case stuff was entered already
        clearInterval(timer);
        pool += current_guess;
        document.getElementById("main").style.display = "none";
        document.getElementById("scores").style.display = "block";
        if (scores != null) {
            // add highscore if relevant
            var i = 0;
            while (i < scores.length && scores[i][1] > score) {
                i++;
            }
            if (i < 10) {
                scores.splice(i, 0, [pool, score]);
                if (scores.length > 10) {
                    scores.pop();
                }
            }
            build_score_table(scores, i);
            save_scores();
        }
        dom_input.innerText = "";
        //dom_score.innerText = "";
        dom_input.innerText = "Game over. Score: " + score;
        dom_input.innerText += "\npress space to restart";
        dom_input.style.fontSize = "20pt";
        //dom_time.innerText = "";
        game_over = true;
    } else {
        timeleft--;
        //dom_time.innerText = "Time left: " + timeleft;
        dom_score.innerText = "Score: " + score + "\n" + "Time left: " + timeleft;
    }
}

function build_score_table(sc, pos) {
    dom_scores.innerHTML = "<h1>"
    if (pos < 10) {
        dom_scores.innerHTML += "New Highscore! ";
    }
    dom_scores.innerHTML += "Your Highscores:</h1><hr>";
    var tbl = document.createElement("table");
    for (var i = 0; i < sc.length; i++) {
        var tr = document.createElement("tr");
        var tbl_pool = document.createElement("td");
        var tbl_score = document.createElement("td");
        var tbl_place = document.createElement("td");
        tbl_place.innerText = "#" + (i+1) + ":";
        tbl_pool.innerText = sc[i][0];
        tbl_score.innerText = sc[i][1] + ",";
        tr.appendChild(tbl_place);
        tr.appendChild(tbl_score);
        tr.appendChild(tbl_pool);
        if (i == pos) {
            tr.style.color = PRESSURE[6];
        }
        tbl.appendChild(tr);
    }
    dom_scores.appendChild(tbl);
}

function load_scores() {
    scores = [];
    if (supports_html5_storage()) {
        if (localStorage["hasscores"] == "true") {
            for (var i = 0; i < 10; i++) {
                if (localStorage["score_" + i] == null) {
                    break;
                }
                var s = parseInt(localStorage["score_" + i]);
                var p = localStorage["pool_" + i];
                scores.push([p, s]);
            }
        }
    }
}

function save_scores() {
    if (supports_html5_storage()) {
        for (var i = 0; i < scores.length; i++) {
            localStorage["pool_" + i] = scores[i][0];
            localStorage["score_" + i] = scores[i][1];
        }
        localStorage["hasscores"] = "true";
    }
}

window.onload = function() {
    load_scores();
    dom_scores = document.getElementById("scores");
    dom_input = document.getElementById("input");
    dom_score = document.getElementById("score");
    dom_pool = document.getElementById("current-pool");
    dom_time = document.getElementById("time");
    dom_already_guessed = document.getElementById("already-guessed");
    all_words = document.getElementById("allwords").innerText.split("\n");
    init();
};
