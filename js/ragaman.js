window.onload = function() {
    html_input = document.getElementById("input");
    html_score = document.getElementById("score");
    html_pool = document.getElementById("current-pool");
    html_time = document.getElementById("time");
    all_words = document.getElementById("allwords").innerText.split("\n");
    init();
};

function init() {
    pool = "";
    possible_words = null;
    game_over = false;
    current_guess = "";
    score = 0;
    already_guessed = [];
    timeleft = 61;
    VOWELS = "TTTTTNNNSSSHHRRDDLLCUMWFGY";
    CONSONANTS = "EEEEEEEAAAAAOOOIII";
    ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    ENTER = 13;
    BACKSPACE = 8;
    SPACE = 32;
    for (var i = 0; i < 4; i++) {
        pool += CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
    }
    for (var i = 0; i < 3; i++) {
        pool += VOWELS[Math.floor(Math.random() * VOWELS.length)];
    }
    pool_left = pool;
    html_pool.innerText = pool;
    timer = window.setInterval(function() {second();}, 1000);
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
    if (game_over) {
        init();
    }
    var key = e.keyCode;
    current_guess = input.innerText;
    if (key == ENTER) {
        // submit
        if (already_guessed.indexOf(current_guess) === -1 && checkWord(current_guess)) {
            score += current_guess.length * current_guess.length;
            already_guessed.push(current_guess);
        }
        current_guess = "";
        pool_left = pool;
    } else if (key == BACKSPACE && input.innerText.length > 0) {
        // delete
        pool_left += current_guess.substr(current_guess.length-1);
        current_guess = current_guess.substr(0,current_guess.length-1);
    } else if (key == SPACE) {
        // shuffle
        pool = pool.shuffle();
    } else {
        var character = String.fromCharCode(e.keyCode);
        var index = pool_left.indexOf(character);
        if (index != -1) {
            // input
            current_guess += character;
            pool_left = pool_left.substring(0,index) + pool_left.substring(1+index);
        }
    }
    html_pool.innerText = pool;
    html_input.innerText = current_guess;
    html_score.innerText = score;
};

function checkWord(word) {
    return all_words.indexOf(word.toLowerCase()) != -1;
}

function second() {
    if (timeleft == 0) {
        // game over
        clearInterval(timer);
        html_input.innerText = "";
        html_score.innerText = "";
        html_pool.innerText = "GAME OVER! SCORE: " + score;
        html_pool.innerText += "\npress any key to restart";
        html_time.innerText = "";
        game_over = true;
    } else {
        timeleft--;
        html_time.innerText = timeleft;
    }
}
