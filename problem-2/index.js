// Get buttons and add observables to monitor clicks
const startButton = document.querySelector('#start-countdown');
const stopButton = document.querySelector('#stop-countdown');
const resetButton = document.querySelector('#reset-countdown');

const startObs = Rx.Observable.fromEvent(startButton, 'click');
const stopObs = Rx.Observable.fromEvent(stopButton, 'click');
const resetObs = Rx.Observable.fromEvent(resetButton, 'click');

// Get users hour, minutes, and seconds input
const userInputHr = document.querySelector('#user-hour')
const userInputMin = document.querySelector('#user-minute')
const userInputSec = document.querySelector('#user-second')

// Get elements where countdown will be displayed
const hours = document.querySelector('#hours');
const minutes = document.querySelector('#minutes')
const seconds = document.querySelector('#seconds')

// Observable created to read when the user clicks the set countdown button
const setTime = document.querySelector('#start-countdown');
const setTimeSource = Rx.Observable.fromEvent(setTime, 'click');

setTimeSource.subscribe(event => {
    // Translate user input into milliseconds
    let userHour = (userInputHr.value * 60 * 60 * 1000);
    let userMin = (userInputMin.value) * 60 * 1000;
    let userSec = (userInputSec.value) * 1000;

    // Get total number of seconds to run countdown for
    let total = userSec + userMin + userHour;
    total = total / 1000;

    // Initialise timer
    startCountdown(total);

    // Set button to say start countdown
    setTime.innerHTML = "Start Countdown";
});

// Function to convert time to hours, minutes and seconds
const toTime = (time) => ({
    hours: Math.floor(time / 3600),
    minutes: Math.floor((time % 3600 / 60)),
    seconds: Math.floor(time % 3600 % 60)
})

// Function to render the time and display it
const render = (time) => {
    // If there is still time left display it
    if((time.seconds) > 0 ||
    (time.minutes) > 0 ||
    (time.hours) > 0) {
        let hourValue = time.hours
        hours.innerHTML = hourValue + ":"
        let minuteValue = time.minutes
        minutes.innerHTML = minuteValue + ":"
        seconds.innerHTML = time.seconds
    } else {
        // Time is up show all zeros
        hours.innerHTML = "0:"
        minutes.innerHTML = "0:"
        seconds.innerHTML = "0"
    }
}

// Set interval to be every second
const interval = Rx.Observable.interval(1000)

// Control what happens when the countdown is stopped or reset
const stopOrResetObs = Rx.Observable.merge(
    stopObs,
    resetObs
)

// Control what happens when countdown is paused
const pauseObs = interval.takeUntil(stopObs);

// Function to control actions when the start countown button is clicked
function startCountdown(initTime) {
    // initialise the time
    const initialise = initTime;

    // Set increment and reset values
    const inc = acc => acc - 1
    const reset = acc => initialise

    const resetOrIncrementetObs = Rx.Observable.merge(
        pauseObs.mapTo(inc),
        resetObs.mapTo(reset),
    )

    app$ = startObs
    .switchMapTo(resetOrIncrementetObs)
    .startWith(initialise)
    .scan((acc, currFunc) => currFunc(acc))
    .map(toTime)
    .subscribe(val => render(val));
}