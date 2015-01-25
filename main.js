(function () {
  'use strict';

  var SCOPE     = this,
    currentDate = new Date();

  function Calendar (options) {
    this.options = options;

    /* List every date day from start till end of this month */
    for (var dateDay = 1; dateDay <= currentDate.getDate(); dateDay += 1) {
      this.options.container.innerHTML += ' ' + dateDay;
    }

    var _currentDayDate = currentDate.getDate();

    currentDate.setDate(dateDay);

    while (currentDate.getDate() > _currentDayDate) {
      this.options.container.innerHTML += ' ' + dateDay;
      dateDay += 1;
      currentDate.setDate(dateDay);
    }
  }

  SCOPE.__calendar = new Calendar({
    container : SCOPE.container
  });

}).call(this);