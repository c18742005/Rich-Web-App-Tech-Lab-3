// Get buttons and add observables to monitor clicks
const startButton = document.querySelector('#start-countdown');
const startObs = Rx.Observable.fromEvent(startButton, 'click');

// Get users hour, minutes, and seconds input
const userInputHr = document.querySelector('#user-hour');
const userInputMin = document.querySelector('#user-minute');
const userInputSec = document.querySelector('#user-second');

// Get elements where countdown will be displayed
const hours = document.querySelector('#hours');
const minutes = document.querySelector('#minutes');
const seconds = document.querySelector('#seconds');

// Function to convert seconds to hours, minutes and seconds
const toTime = (time) => ({
    hours: Math.floor(time / 3600),
    minutes: Math.floor((time % 3600 / 60)),
    seconds: Math.floor(time % 3600 % 60)
});

// Function to render the time to the UI
const render = (time) => {
    // If there is still time left display it
    if((time.seconds) > 0 ||
    (time.minutes) > 0 ||
    (time.hours) > 0) {
        let hourValue = time.hours;
        hours.innerHTML = hourValue + ":";
        let minuteValue = time.minutes;
        minutes.innerHTML = minuteValue + ":";
        seconds.innerHTML = time.seconds;
    } else {
        // Time is up show all zeros
        hours.innerHTML = "0:";
        minutes.innerHTML = "0:";
        seconds.innerHTML = "0";
    }
}

// Subscribe to the start button click
app$ = startObs.subscribe(() => {

    // Translate user input into milliseconds
    let userHour = (userInputHr.value * 60 * 60 * 1000);
    let userMin = (userInputMin.value) * 60 * 1000;
    let userSec = (userInputSec.value) * 1000;

    // Get total number of seconds to run countdown for
    let total = userSec + userMin + userHour;
    total = total / 1000;

    // Set interval to 1 second
    let timer$ = Rx.Observable.interval(1000);

    timer$
        .take(total)
        .map((val) => (total - 1) - val) // decrement until timer hits 0
        .map(toTime) // map time to hours minutes and seconds
        .subscribe((time) => {
            toTime(time);
            render(time);
            console.log('Countdown', time);
        });
});