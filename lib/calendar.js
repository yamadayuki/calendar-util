'use strict';

export default class Calendar {
  constructor(startDay) {
    // startDay is the first day of the week.
    // Sunday(0) is regarded as the first day of the week.
    if ((startDay < 0) || (startDay > 6)) {
      throw new DayError();
    }
    this.startDay = startDay || 0; // 0 == Sunday
  }

  /**
   * setStartDay - Change the first day of the week.
   *
   * @param  {number} startDay The day of the week to change.
   */
  setStartDay(startDay) {
    if ((startDay < 0) || (startDay > 6)) {
      throw new DayError();
    }
    this.startDay = startDay;
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
      throw new YearError();
    }
    if ((typeof month !== 'number') || (month < 0) || (month > 11)) {
      throw new MonthError();
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
      var now = new Date();
      year = now.getFullYear();
      month = now.getMonth();
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
 * YearError - Error around Year.
 */
function YearError() {
  this.message = 'year must be a number >= 1970';
  this.toString = () => {
    return this.constructor.name + ': ' + this.message;
  };
}

/**
 * MonthError - Error around Month.
 */
function MonthError() {
  this.message = 'month must be a number within 0 to 11 (January is 0)';
  this.toString = () => {
    return this.constructor.name + ': ' + this.messaage;
  };
}

/**
 * DayError - Error around Month.
 */
function DayError() {
  this.message = 'if day is provided, it must be within 0 to 11 (Sunday is 0)';
  this.toString = () => {
    return this.constructor.name + ': ' + this.messaage;
  };
}
