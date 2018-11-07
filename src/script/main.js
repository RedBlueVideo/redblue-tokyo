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

function playMusic() {
  $someday.play();
}

// Init
var $html = document.documentElement;
$html.classList.remove( 'no-js' );
$html.classList.add( 'js' );

var $checkbox = document.getElementById( 'checkbox' );
var $hamburger = document.getElementById( 'hamburger' );
var $hamburgerTarget = document.getElementById( $hamburger.getAttribute( 'aria-controls' ) );
var $trayLinks = document.querySelectorAll( '.tray-link' );
var $someday = document.getElementById( 'someday' );
var $volume = document.getElementById( 'volume' );
var $nav = document.querySelector( 'nav' );

var KEY_ENTER = 13;
var KEY_SPACE = 32;

$nav.addEventListener( 'click', function ( event ) {
  event.stopPropagation();
} );

// Accessibility
function takeTrayLinksOutOfTabOrder() {
  for ( var i = 0; i < $trayLinks.length; i++ ) {
    $trayLinks[i].setAttribute( 'tabindex', '-1' );
  }
}

function putTrayLinksIntoTabOrder() {
  for ( var i = 0; i < $trayLinks.length; i++ ) {
    $trayLinks[i].setAttribute( 'tabindex', '0' );
  }
}

function setExpandedMenuState( $button, $toggleTarget ) {
  var $toggleTarget = ( $toggleTarget || document.getElementById( $button.getAttribute( 'aria-controls' ) ) );

  $button.setAttribute( 'aria-expanded', 'true' );
  $toggleTarget.setAttribute( 'aria-hidden', 'false' );
  putTrayLinksIntoTabOrder();

  setTimeout( function () {
    document.body.addEventListener( 'click', collapseHamburgerMenu );
  }, 0 );
}

function expandHamburgerMenu() {
  if ( $hamburger.getAttribute( 'aria-expanded' ) === 'false' ) {
    $checkbox.checked = true;
    setExpandedMenuState( $hamburger, $hamburgerTarget );
  }
}

function setCollapsedMenuState( $button, $toggleTarget ) {
  var $toggleTarget = ( $toggleTarget || document.getElementById( $button.getAttribute( 'aria-controls' ) ) );

  $button.setAttribute( 'aria-expanded', 'false' );
  $toggleTarget.setAttribute( 'aria-hidden', 'true' );
  takeTrayLinksOutOfTabOrder();

  setTimeout( function () {
    document.body.removeEventListener( 'click', collapseHamburgerMenu );
  }, 0 );
}

function collapseHamburgerMenu( event ) {
  if ( $hamburger.getAttribute( 'aria-expanded' ) === 'true' ) {
    $checkbox.checked = false;
    setCollapsedMenuState( $hamburger, $hamburgerTarget );
  }
}

function hamburgerKeyHandler( event ) {
  switch ( event.which ) {
    case KEY_ENTER:
    case KEY_SPACE: {
      event.stopPropagation();

      if ( $hamburger.getAttribute( 'aria-expanded' ) === "false" ) {
        $hamburger.click();
        $hamburger.focus();
        setExpandedMenuState( $hamburger, $hamburgerTarget );
      } else {
        $hamburger.click();
        $hamburger.focus();
        setCollapsedMenuState( $hamburger, $hamburgerTarget );
      }
      break;
    }
  } //end switch

  return true;
}

function hamburgerClickHandler( event ) {
  if ( $hamburger.getAttribute( 'aria-expanded' ) === "false" ) {
    setExpandedMenuState( $hamburger, $hamburgerTarget );
  } else {
    setCollapsedMenuState( $hamburger, $hamburgerTarget );
  }
}

function isPlaying( media ) {
  return !!( media.currentTime > 0 && !media.paused && !media.ended && media.readyState > 2 );
}

takeTrayLinksOutOfTabOrder();

$hamburger.addEventListener( 'keypress', hamburgerKeyHandler );
$hamburger.addEventListener( 'click', hamburgerClickHandler );

$volume.addEventListener( 'click', function ( event ) {
  switch ( $volume.textContent ) {
    case '🔊':
      $volume.textContent = $volume.getAttribute( 'data-muted-icon' );
      $someday.muted = true;
    break;

    case '🔇':
      $volume.textContent = $volume.getAttribute( 'data-playing-icon' );
      $someday.muted = false;
    break;
  }
} );

// Date & time
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

function startMusic() {
  if ( !isPlaying( $someday ) ) {
    playMusic();
  }

  window.removeEventListener( 'scroll', startMusic );
  document.removeEventListener( 'click', startMusic );
}

window.addEventListener( 'scroll', startMusic );
document.addEventListener( 'click', startMusic );

// Language
// var $language = document.getElementById( 'language' );
// var $brandName = document.getElementById( 'brand-name' );
// var $branchName = document.getElementById( 'branch-name' );
// var $motivationNihongo = document.getElementById( 'motivation-nihongo' );
// var $motivationEigo = document.getElementById( 'motivation-eigo' );
// var $currentTimeText = document.getElementById( 'current-time-text' );
// var $yearKanji = document.getElementById( 'year-kanji' );
// var $monthKanji = document.getElementById( 'month-kanji' );
// var $dayKanji = document.getElementById( 'day-kanji' );
// var $hourKanji = document.getElementById( 'hour-kanji' );
// var $minuteKanji = document.getElementById( 'minute-kanji' );
// var $secondsKanji = document.getElementById( 'seconds-kanji' );
// var $amNihongo = document.getElementById( 'am-nihongo' );
// var $pmNihongo = document.getElementById( 'pm-nihongo' );
// var $amEigo = document.getElementById( 'am-eigo' );
// var $pmEigo = document.getElementById( 'pm-eigo' );
// var $visaResources = document.getElementById( 'visa-resources' );
// var $middleDot = document.getElementById( 'middle-dot' );
// var $title = document.querySelector( 'title' );
//
// var lang = {
//   "BRAND_NAME": {
//     "ja": "レッドブルー",
//     "en": "RedBlue"
//   },
//   "BRANCH_NAME": {
//     "ja": "東京支社",
//     "en": "Tokyo Branch"
//   },
//   "CURRENT_TIME": {
//     "ja": "東京での現在時刻：",
//     "en": "Current time in Tokyo:"
//   },
//   "YEAR_KANJI": {
//     "ja": "年",
//     "en": "-"
//   },
//   "MONTH_KANJI": {
//     "ja": "月",
//     "en": "-"
//   },
//   "DAY_KANJI": {
//     "ja": "日",
//     "en": ""
//   },
//   "HOUR_KANJI": {
//     "ja": "時",
//     "en": ":"
//   },
//   "MINUTE_KANJI": {
//     "ja": "分",
//     "en": ":"
//   },
//   "SECONDS_KANJI": {
//     "ja": "秒",
//     "en": ""
//   },
//   "VISA_RESOURCES": {
//     "ja": "ビザのリソース",
//     "en": "Visa Resources"
//   },
//   "MIDDLE_DOT": {
//     "ja": "・",
//     "en": " · "
//   }
// };
//
// lang.TITLE = {
//   "ja": lang.BRAND_NAME.ja + lang.MIDDLE_DOT.ja + lang.BRANCH_NAME.ja,
//   "en": lang.BRAND_NAME.en + lang.MIDDLE_DOT.en + lang.BRANCH_NAME.en
// };
//
// $language.addEventListener( 'click', function ( event ) {
//   event.preventDefault();
//
//   var $clicked = event.target;
//   ( $clicked.nextElementSibling || $clicked.previousElementSibling ).classList.remove( 'active' );
//   $clicked.classList.add( 'active' );
//
//   switch ( $clicked.textContent ) {
//     case '🇯🇵':
//       $html.setAttribute( 'lang', 'ja' );
//       $html.setAttribute( 'xml:lang', 'ja' );
//       $title
//       $brandName.textContent = lang.BRAND_NAME.ja;
//       $branchName.textContent = lang.BRANCH_NAME.ja;
//       $currentTimeText.textContent = lang.CURRENT_TIME.ja;
//       $yearKanji.textContent = lang.YEAR_KANJI.ja;
//       $monthKanji.textContent = lang.MONTH_KANJI.ja;
//       $dayKanji.textContent = lang.DAY_KANJI.ja;
//       $hourKanji.textContent = lang.HOUR_KANJI.ja;
//       $minuteKanji.textContent = lang.MINUTE_KANJI.ja;
//       $secondsKanji.textContent = lang.SECONDS_KANJI.ja;
//       $visaResources.textContent = lang.VISA_RESOURCES.ja;
//       $middleDot.textContent = lang.MIDDLE_DOT.ja;
//       $title.textContent = lang.TITLE.ja;
//       $motivationEigo.hidden = true;
//       $motivationNihongo.hidden = false;
//       $amEigo.hidden = true;
//       $amNihongo.hidden = false;
//       $pmEigo.hidden = true;
//       $pmNihongo.hidden = false;
//     break;
//
//     case '🇺🇸':
//       $html.setAttribute( 'lang', 'en' );
//       $html.setAttribute( 'xml:lang', 'en' );
//       $brandName.textContent = lang.BRAND_NAME.en;
//       $branchName.textContent = lang.BRANCH_NAME.en;
//       $currentTimeText.textContent = lang.CURRENT_TIME.en;
//       $yearKanji.textContent = lang.YEAR_KANJI.en;
//       $monthKanji.textContent = lang.MONTH_KANJI.en;
//       $dayKanji.textContent = lang.DAY_KANJI.en;
//       $hourKanji.textContent = lang.HOUR_KANJI.en;
//       $minuteKanji.textContent = lang.MINUTE_KANJI.en;
//       $secondsKanji.textContent = lang.SECONDS_KANJI.en;
//       $visaResources.textContent = lang.VISA_RESOURCES.en;
//       $middleDot.textContent = lang.MIDDLE_DOT.en;
//       $title.textContent = lang.TITLE.en;
//       $motivationEigo.hidden = false;
//       $motivationNihongo.hidden = true;
//       $amEigo.hidden = false;
//       $amNihongo.hidden = true;
//       $pmEigo.hidden = false;
//       $pmNihongo.hidden = true;
//     break;
//   }
// } )