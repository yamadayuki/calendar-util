'use strict';

import i18n, {locales} from './i18n';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const days = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export default class Calendar {
  constructor(startDay, locale) {
    // startDay is the first day of the week.
    // Sunday(0) is regarded as the first day of the week.
    if ((startDay < 0) || (startDay > 6)) {
      throw new CalendarError('day');
    }

    if ((typeof locale !== 'undefined') && (typeof locale !== 'string')) {
      throw new CalendarError('locale');
    }

    this.locale = 'en';

    if (locales.indexOf(locale) !== -1) {
      this.locale = locale;
    }

    i18n.setLocale(this.locale);
    this.startDay = startDay || 0; // 0 == Sunday
    var current = new Date();
    this.year = current.getFullYear();
    this.month = current.getMonth();
    this.date = current.getDate();
    this.day = current.getDay();
    this.dayString = i18n.__(days[this.day]);
    this.monthString = i18n.__(months[this.month]);
  }

  /**
   * setStartDay - Change the first day of the week.
   *
   * @param  {number} startDay The day of the week to change.
   */
  setStartDay(startDay) {
    if ((startDay < 0) || (startDay > 6)) {
      throw new CalendarError('day');
    }
    this.startDay = startDay;
  }

  /**
   * setLocale - Change the locale.
   *
   * @param  {string} locale The locale to use.
   */
  setLocale(locale) {
    if ((typeof locale !== 'string') || (locales.indexOf(locale) === -1)) {
      throw new CalendarError('locale');
    }
    this.locale = locale;
    i18n.setLocale(locale);
    this.dayString = i18n.__(days[this.day]);
    this.monthString = i18n.__(months[this.month]);
  }

  /**
   * firstDate - Find the first day of the week.
   *
   * @param  {Date} date The first day of the month.
   * @return {Date} Return the first day of the week according to the first day
   *   of the month.
   */
  firstDate(date) {
    var startDate = new Date(date.getTime());
    while (startDate.getDay() !== this.startDay) {
      startDate.setDate(startDate.getDate() - 1);
    }
    return startDate;
  }

  /**
   * monthDates - Get month dates.
   *
   * @param  {number} year A number of year.
   * @param  {number} month A number of month.
   * @param  {function(Date):Object} dateFormatter Formatter to arrange the date
   *   format.
   * @param  {function(Array):Object} weekFormatter Formatter to arrange the
   *   week format.
   * @return {Array<Date>} The array of the dates of the weeks.
   */
  monthDates(year, month, dateFormatter, weekFormatter) {
    if ((typeof year !== 'number') || (year < 1970)) {
      throw new CalendarError('year');
    }
    if ((typeof month !== 'number') || (month < 0) || (month > 11)) {
      throw new CalendarError('month');
    }

    var weeks = [];
    var week = [];
    var i = 0;
    var date = this.firstDate(new Date(year, month, 1));

    do {
      for (i = 0; i < 7; i++) {
        week.push(dateFormatter ? dateFormatter(date) : date);
        date = new Date(date.getTime());
        date.setDate(date.getDate() + 1);
      }
      weeks.push(weekFormatter ? weekFormatter(week) : week);
      week = [];
    } while ((date.getMonth() <= month) && (date.getFullYear() === year));

    return weeks;
  }

  /**
   * days - Get the Array of the week.
   *
   * @param  {number} year A number of year.
   * @param  {number} month A number of month.
   * @return {Object} Return of the monthDates() method.
   */
  days(year, month) {
    if (typeof year === 'undefined') {
      year = this.year;
      month = this.month;
    }

    return this.monthDates(year, month, date => {
      return date.getMonth() === month ? date.getDate() : 0;
    });
  }

  /**
   * calendar - Get the calendar texts.
   *
   * @param  {number} year A number of year.
   * @param  {number} month A number of month.
   * @return {string} Return the calendar texts.
   */
  calendar(year, month) {
    if (typeof year === 'undefined') {
      year = this.year;
      month = this.month;
    }

    var weeks = this.monthDates(year, month, date => {
      var s = date.getMonth() === month ? date.getDate().toString() : ' ';
      while (s.length < 2) {
        s = ' ' + s;
      }
      return s;
    }, week => {
      return week.join(' ');
    });
    return weeks.join('\n');
  }
}

/**
 * CalendarError - Error caused by calendar.
 *
 * @param  {string} type Provide information to find error type.
 */
function CalendarError(type) {
  var message;
  switch (type) {
    case 'year':
      message = 'year must be a number >= 1970';
      break;
    case 'month':
      message = 'month must be a number within 0 to 11 (January is 0)';
      break;
    case 'day':
      message = 'day must be within 0 to 11 (Sunday is 0)';
      break;
    case 'locale':
      message = 'locale must be string';
      break;
    default:
      message = 'something is wrong';
      break;
  }

  this.message = message;
  this.toString = () => {
    return this.constructor.name + '<' + type + '> : ' + this.message;
  };
}
