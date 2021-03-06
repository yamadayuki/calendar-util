import {expect} from 'chai';
import Calendar, {CalendarError} from '../lib/calendar';

describe('Calendar', () => {
  describe('constructor', () => {
    it('initialize', () => {
      var cal = new Calendar();
      expect(cal).to.have.ownProperty('startDay');
      expect(cal).to.have.ownProperty('year');
      expect(cal).to.have.ownProperty('month');
      expect(cal).to.have.ownProperty('date');
      expect(cal).to.have.ownProperty('day');
      expect(cal).to.have.ownProperty('dayString');
      expect(cal).to.have.ownProperty('locale');
    });

    it('initialize with startDay = 0', () => {
      var cal = new Calendar();
      expect(cal.startDay).to.equal(0);
    });

    it('initialize with startDay = 1', () => {
      var cal = new Calendar(1);
      expect(cal).to.have.ownProperty('startDay');
      expect(cal.startDay).to.equal(1);
    });

    it('raise Exception out of 0 to 6', () => {
      var fn = () => new Calendar(8);
      expect(fn).to.throw(CalendarError);
    });

    it('initialize with locale = `fr`', () => {
      var cal = new Calendar(0, 'fr');
      expect(cal).to.have.ownProperty('locale');
      expect(cal.locale).to.equal('fr');
    });
  });

  describe('firstDate', () => {
    describe('when calendar start on Sunday', () => {
      var cal;

      beforeEach(() => {
        cal = new Calendar();
      });

      it('inialize with 0', () => {
        expect(cal).to.have.ownProperty('startDay');
        expect(cal.startDay).to.equal(0);
      });

      it('find first day of the week', () => {
        var date = new Date(2016, 2, 17); // 3/17/2016
        var startDate = cal.firstDate(date);
        expect(startDate.getDate()).to.equal(13); // 3/13/2016
        expect(startDate.getDay()).to.equal(0); // 3/13 -> Sunday
      });

      it('find first day beyond the month', () => {
        var date = new Date(2016, 2, 1); // 3/1/2016
        var startDate = cal.firstDate(date);
        expect(startDate.getDate()).to.equal(28); // 2/28/2016
        expect(startDate.getDay()).to.equal(0); // 2/28 -> Sunday
      });
    });

    describe('when calendar start on Monday', () => {
      var cal;

      beforeEach(() => {
        cal = new Calendar(1);
      });

      it('inialize with 1', () => {
        expect(cal).to.have.ownProperty('startDay');
        expect(cal.startDay).to.equal(1);
      });

      it('find first day of the week', () => {
        var date = new Date(2016, 2, 17); // 3/17/2016
        var startDate = cal.firstDate(date);
        expect(startDate.getDate()).to.equal(14); // 3/14/2016
        expect(startDate.getDay()).to.equal(1); // 3/12 -> Monday
      });

      it('find first day beyond the month', () => {
        var date = new Date(2016, 2, 1); // 3/1/2016
        var startDate = cal.firstDate(date);
        expect(startDate.getDate()).to.equal(29); // 2/29/2016
        expect(startDate.getDay()).to.equal(1); // 2/29 -> Monday
      });
    });
  });

  describe('monthDates', () => {
    var cal;

    beforeEach(() => {
      cal = new Calendar();
    });

    it('get the array of the dates of the weeks which starts on Sunday', () => {
      var weeks = cal.monthDates(2016, 2);
      expect(weeks).to.be.a('array');
      expect(weeks[0][0]).to.deep.equal(new Date(2016, 1, 28));
    });

    it('get the array of the dates of the weeks which starts on Monday', () => {
      cal.setStartDay(1);
      var weeks = cal.monthDates(2016, 2);
      expect(weeks).to.be.a('array');
      expect(weeks[0][0]).to.deep.equal(new Date(2016, 1, 29));
    });

    it('use dateFormatter to get the array of the date numbers', () => {
      var weeks = cal.monthDates(2016, 2, date => date.getDate());
      expect(weeks).to.be.a('array');
      expect(weeks[0][0]).to.deep.equal(28);
    });

    it('use weekFormatter to get the array of the date numbers', () => {
      var weeks = cal.monthDates(2016, 2,
        date => date,
        week => week.map(date => date.getDate())
      );
      expect(weeks).to.be.a('array');
      expect(weeks[0][0]).to.deep.equal(28);
    });

    it('validate year with string', () => {
      var fn = () => cal.monthDates('2016', 2);
      expect(fn).to.throw(CalendarError);
    });

    it('validate year number out of the range', () => {
      var fn = () => cal.monthDates(1192, 2);
      expect(fn).to.throw(CalendarError);
    });

    it('validate month with string', () => {
      var fn = () => cal.monthDates(2016, '2');
      expect(fn).to.throw(CalendarError);
    });

    it('validate month number out of the range', () => {
      var fn = () => cal.monthDates(2016, 13);
      expect(fn).to.throw(CalendarError);
    });
  });

  describe('days', () => {
    var cal;

    beforeEach(() => {
      cal = new Calendar();
    });

    it('get the array of the dates of the weeks which starts on Sunday', () => {
      // Feb, 2016 calendar start on Sunday
      // [
      //   [0, 1, 2, 3, 4, 5, 6],
      //   [7, 8, 9, 10, 11, 12, 13],
      //   [14, 15, 16, 17, 18, 19, 20],
      //   [21, 22, 23, 24, 25, 26, 27],
      //   [28, 29, 0, 0, 0, 0, 0]
      // ]
      var weeks = cal.days(2016, 1);
      expect(weeks).to.be.a('array');
      expect(weeks[0][0]).to.equal(0);
    });

    it('get the array of the dates of the weeks which starts on Monday', () => {
      // Feb, 2016 calendar start on Monday
      // [
      //   [1, 2, 3, 4, 5, 6, 7],
      //   [8, 9, 10, 11, 12, 13, 14],
      //   [15, 16, 17, 18, 19, 20, 21],
      //   [22, 23, 24, 25, 26, 27, 28],
      //   [29, 0, 0, 0, 0, 0, 0]
      // ]
      cal.setStartDay(1);
      var weeks = cal.days(2016, 1);
      expect(weeks).to.be.a('array');
      expect(weeks[0][0]).to.equal(1);
    });

    it('validate year with string', () => {
      var fn = () => cal.monthDates('2016', 2);
      expect(fn).to.throw(CalendarError);
    });

    it('validate year number out of the range', () => {
      var fn = () => cal.monthDates(1192, 2);
      expect(fn).to.throw(CalendarError);
    });

    it('validate month with string', () => {
      var fn = () => cal.monthDates(2016, '2');
      expect(fn).to.throw(CalendarError);
    });

    it('validate month number out of the range', () => {
      var fn = () => cal.monthDates(2016, 13);
      expect(fn).to.throw(CalendarError);
    });

    it('get the array of the dates of current month without arguments', () => {
      var current = new Date();
      var weeks = cal.days();
      var currentWeeks = cal.days(current.getFullYear(), current.getMonth());
      expect(weeks).to.be.a('array');
      expect(weeks.join(' ')).to.deep.equal(currentWeeks.join(' '));
    });
  });

  describe('calendar', () => {
    var cal;

    beforeEach(() => {
      cal = new Calendar();
    });

    it('return string value', () => {
      var calendar = cal.calendar(2016, 2);
      expect(calendar).to.be.a('string');
    });

    it('return current month calendar without arguments', () => {
      var today = new Date();
      var currentCalendar = cal.calendar(today.getFullYear(), today.getMonth());
      var blankCalendar = cal.calendar();
      expect(currentCalendar).to.equal(blankCalendar);
    });

    it('return alternative calendar when the startDay is changed', () => {
      var calendar = cal.calendar(2016, 2);
      cal.setStartDay(1);
      var alternativeCalendar = cal.calendar(2016, 2);
      expect(calendar).to.not.deep.equal(alternativeCalendar);
    });
  });

  describe('setStartDay', () => {
    it('change startDay from 0 to 1', () => {
      var cal = new Calendar();
      expect(cal).to.have.ownProperty('startDay');
      expect(cal.startDay).to.equal(0);
      cal.setStartDay(1);
      expect(cal.startDay).to.equal(1);
    });

    it('validate startDay number out of the range', () => {
      var cal = new Calendar();
      expect(cal).to.have.ownProperty('startDay');
      expect(cal.startDay).to.equal(0);
      var fn = () => cal.setStartDay(8);
      expect(fn).to.throw(CalendarError);
      expect(cal.startDay).to.equal(0);
    });
  });

  describe('setLocale', () => {
    var cal;

    beforeEach(() => {
      cal = new Calendar();
    });

    it('change locale from en to fr', () => {
      expect(cal).to.have.ownProperty('locale');
      expect(cal.locale).to.equal('en');
      cal.setLocale('fr');
      expect(cal.locale).to.equal('fr');
    });

    it('change member variable dependent on changing locale', () => {
      expect(cal).to.have.ownProperty('locale');
      var fn = () => cal.setLocale('fr');
      expect(fn).to.change(cal, 'monthString');
    });

    it('change member variable dependent on changing locale', () => {
      expect(cal).to.have.ownProperty('locale');
      var fn = () => cal.setLocale('fr');
      expect(fn).to.change(cal, 'dayString');
    });

    it('validate locale to be string', () => {
      expect(cal).to.have.ownProperty('locale');
      expect(cal.locale).to.equal('en');
      var fn = () => cal.setLocale(123);
      expect(fn).to.throw(CalendarError);
      expect(cal.locale).to.equal('en');
    });
  });
});
