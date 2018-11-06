'use strict';

// https://stackoverflow.com/a/46261084/214325
function getTokyoTime() {
  // create Date object for current location
  var date = new Date();

  // convert to milliseconds, add local time zone offset and get UTC time in milliseconds
  var utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);

  // time offset for Tokyo is +9
  var timeOffset = 9;

  // create new Date object for a different timezone using supplied its GMT offset.
  return new Date(utcTime + (3600000 * timeOffset));
}

function isLastDay( dt ) {
  return new Date( dt.getTime() + 86400000 ).getDate() === 1;
}

function isNewYears() {
  return ( $month.textContent === '12' ) && ( $day.textContent === '31' );
}

function displayTokyoTime() {
  var tokyoTime = getTokyoTime();
  var isCurrentlyLastDay = isLastDay( tokyoTime );
  var hours = tokyoTime.getHours();
  var minutes = tokyoTime.getMinutes();
  var seconds = tokyoTime.getSeconds();

  if ( !$year.textContent.length || isNewYears() ) {
    $year.textContent = tokyoTime.getFullYear();
  }

  if ( !$month.textContent.length || isCurrentlyLastDay ) {
    $month.textContent = tokyoTime.getMonth();
  }

  if ( !$day.textContent.length || ( hours >= 23 ) || ( hours <= 1 ) ) {
    $day.textContent = tokyoTime.getDate();
  }

  if ( !$hour.textContent.length || ( seconds >= 59 ) || ( seconds <= 1 ) ) {
    if ( hours >= 12 ) {
      $hour.textContent = hours - 12;
      $am.hidden = true;
      $pm.hidden = false;
    } else {
      $am.hidden = false;
      $pm.hidden = true;
    }

    if ( hours === 0 ) {
      $hour.textContent = '12';
    }
  }

  $minutes.textContent = ( minutes >= 10 ) ? minutes : '0' + minutes;
  $seconds.textContent = ( seconds >= 10 ) ? seconds : '0' + seconds;
  $datetime.setAttribute( 'datetime', tokyoTime.toISOString() );
}

var $html = document.documentElement;
$html.classList.remove( 'no-js' );
$html.classList.add( 'js' );

var $currentTime = document.getElementById( 'current-time' );
var $year = document.getElementById( 'year' );
var $month = document.getElementById( 'month' );
var $day = document.getElementById( 'day' );
var $hour = document.getElementById( 'hour' );
var $minutes = document.getElementById( 'minutes' );
var $seconds = document.getElementById( 'seconds' );
var $am = document.getElementById( 'am' );
var $pm = document.getElementById( 'pm' );
var $datetime = document.getElementById( 'datetime' );

displayTokyoTime();

setTimeout( function () {
  $currentTime.style.opacity = 1;
}, 1000 );

setInterval( displayTokyoTime, 1000 );