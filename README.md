# Calendar Util

Provides calendar util. It can manage calendar.

## Usage

Importing Calendar class and create instance.

```js
import Calendar from './lib/calendar';

var cal = new Calendar();
```

### API

### `days(year, month)`

params: year(optional), month(optional)  
This method returns the array of the days.

```js
// Feb, 17, 2016
var cal = new Calendar();
var d = cal.days(); // Return the array of the days which is current year and month.
console.log(d); // Feb, 2016
// [
//   [0, 1, 2, 3, 4, 5, 6],
//   [7, 8, 9, 10, 11, 12, 13],
//   [14, 15, 16, 17, 18, 19, 20],
//   [21, 22, 23, 24, 25, 26, 27],
//   [28, 29, 0, 0, 0, 0, 0]
// ]
```

### `calendar(year, month)`

params: year(optional), month(optional)  
This method returns the string of the calendar.

```js
var c = cal.days(); // Return the string of the calendar which is current year and month.
console.log(c); // Feb, 2016
// [
//   [1, 2, 3, 4, 5, 6, 7],
//   [8, 9, 10, 11, 12, 13, 14],
//   [15, 16, 17, 18, 19, 20, 21],
//   [22, 23, 24, 25, 26, 27, 28],
//   [29, 0, 0, 0, 0, 0, 0]
// ]
```

### `monthDates(year, month, dateFormatter, weekFormatter)`

params: year, month, dateFormatter(optional), weekFormatter(optional)  
This method returns the array of the Date objects.

```js
var dates = cal.monthDates(2016, 1); // Feb, 2016
console.log(dates);
// Array of the Date objects.
```
