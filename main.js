'use strict';
var CalendarBuilder = function (options) {
	// main options
	this.options = options;
	this.options.current_date = new Date();
	this.options.current_day = this.options.current_date.getDate();
	this.options.current_day_of_week = this.options.current_date.getDay();
	this.options.current_month = this.options.current_date.getMonth();
	this.options.current_year = this.options.current_date.getFullYear();

	// hardcoded data
	this.options.month_array = options.month_array || ['January', 'February',
		'March', 'April', 'May', 'June', 'July', 'August', 'September',
		'October', 'November', 'December'];
	this.options.days_array = options.days_array || ['Monday', 'Tuesday',
		'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	// for monthly build
	this.options.new_date = new Date(
		this.options.current_year, this.options.current_month);
	this.options.new_date_day_of_week = this.options.new_date.getDay();
	this.options.new_date_day = this.options.new_date.getDate();

	// builder options
	this.options.tr_array = [];
	this.options.td_array = [];
	this.options.last_day_of_month = 0;

	// hardcoded rows
	// and cells
	this.calendar_rows = 6;
	this.calendar_cells = 7;

	this.init();
};

CalendarBuilder.prototype.create_help_lib = function () {

	var self = this;

	CalendarBuilder.prototype.lib = {};

	CalendarBuilder.prototype.lib.get_real_day = function (date) {
		var day = date.getDay() - 1,
			real_day;

		if (day === -1) {
			real_day = 6;
		} else if (day === 6) {
			real_day = 5;
		} else {
			real_day = day;
		}

		return real_day;
	};
};

CalendarBuilder.prototype.build_calendar_layout = function () {
	var frg = document.createDocumentFragment(),
		table = document.createElement('table'),
		tbody = document.createElement('tbody'),
		thead = table.createTHead(), // document.createElement('thead'),
		tfoot = table.createTFoot(),

		tr_array = this.options.tr_array,
		td_array = this.options.td_array,

		i = 0,
		j = 0;

	thead.className = 'days_of_week';

	this.options.table = table;
	this.options.thead = thead;
	this.options.tbody = tbody;
	this.options.tfoot = tfoot;

	// table.appendChild(thead);
	table.appendChild(tbody);
	frg.appendChild(table);

	function add_row (tbody, index) {
		// var new_tr = document.createElement('tr');
		// tr_array.push(tbody.appendChild(new_tr));
		tr_array.push(tbody.insertRow(-1));
	}

	function add_cell (tr, index) {
		// var new_td = document.createElement('td');
		// td_array.push(tr.appendChild(new_td));
		td_array.push(tr.insertCell(-1));
	}

	// TODO replace with map and forEach
	// build rows
	for ( ; i < this.calendar_rows; i += 1 ) {
		add_row(tbody, i);

		// build cells
		for ( j = 0; j < this.calendar_cells; j += 1 ) {
			add_cell(tr_array[i], j);
		}
	}

	this.options.container.appendChild(frg);
};

//TODO make it better
CalendarBuilder.prototype.fill_cells = function () {

	var real_calendar_day = this.lib.get_real_day(this.options.new_date);

	this.options.first_day = this.options.td_array[real_calendar_day];
	this.options.td_array[real_calendar_day].innerHTML = this.options.new_date_day;
	this.options.new_date.setDate(this.options.new_date_day += 1);

	// console.log(this.options.new_date.getDay());

	while ( this.options.new_date.getDate() !== 1 ) {
		if (this.options.new_date.getDate() === this.options.current_day) {
			this.options.today = this.options.td_array[real_calendar_day + 1];
		}
		real_calendar_day += 1;
		this.options.td_array[real_calendar_day].innerHTML = this.options.new_date_day;
		this.options.new_date_day += 1;
		this.options.new_date.setDate(this.options.new_date_day);
	}
};

CalendarBuilder.prototype.set_month_label = function () {
	this.options.caption = this.options.table.createCaption();
	this.options.caption.innerHTML =
		this.options.month_array[this.options.current_month];
};

CalendarBuilder.prototype.set_cell_html = function (index) {
	if (this.options.new_date_day_of_week() === index) {
		this.options.last_day_of_month += 1;
	}
};

CalendarBuilder.prototype.highlight_control_days = function () {
	this.options.first_day.className = 'first';
	this.options.first_day.title = 'first day of month';
	this.options.today.className = 'today';
	this.options.today.title = 'this is today';
};

CalendarBuilder.prototype.set_week_days = function () {
	var tr = this.options.thead.insertRow(-1),
		th,
		i = 0;

	for ( ; i < this.calendar_cells; i += 1 ) {
		th = document.createElement('th');
		th.innerHTML = this.options.days_array[i];
		tr.appendChild(th);
	}
};

CalendarBuilder.prototype.rebuildWith = function (params) {
	//TODO rebuild at the same place with another data
};

CalendarBuilder.prototype.init = function () {
	this.create_help_lib();
	this.build_calendar_layout();
	this.fill_cells();
	this.set_month_label();
	this.highlight_control_days();
	this.set_week_days();
};


/*
 *
 * Calendar's controls constructor
 *
 * */

var CalendarControls = function (options) {
	// store options
	this.options = options || {};

	// container to insert controls
	this.containerToInsert = options.containerToInsert;

	// main control items settings
	this.nextOptions = options.nextOptions || {};
	this.prevOptions = options.prevOptions || {};

	// create prev and next buttons
	this.next = this.createControl('next', this.nextOptions);
	this.prev = this.createControl('prev', this.prevOptions);

	// append controls
	this.containerToInsert.appendChild(this.next);
	this.containerToInsert.appendChild(this.prev);
};

CalendarControls.prototype.createControl = function (side, options) {
	var holder, element;

	function _setPreventableState (event) {
		event.preventDefault();
	}

	holder = document.createDocumentFragment();
	element = document.createElement(options.elementType || 'a');

	element.dataset.side = side;
	element.className = options.className || side;
	element.innerHTML = options.innerHTML || side;
	element.href = options.href || '#';

	// need to prevent ?
	(options.isPreventable) ?
		element.onclick = _setPreventableState :
		null;

	// add events
	element.addEventListener('click', this.sideAction.bind(this));

	holder.appendChild(element);

	return holder;
};

CalendarControls.prototype.sideAction = function (event) {
	var self, actions, dataSide;

	self = this;
	dataSide = event.target.dataset.side;
	actions = {
		'prev': function () {
			self.options.calendar.rebuildWith({
				'month': -1,
				'year' : 0
			});
		},
		'next': function () {
			self.options.calendar.rebuildWith({
				'month': +1,
				'year' : 0
			});
		}
	};

	actions[dataSide] && actions[dataSide]();
};

var calendar = new CalendarBuilder({
	container: document.getElementById('container')
});
var controls = new CalendarControls({
	calendar         : calendar,
	containerToInsert: calendar.options.container,
	nextOptions      : {
		isPreventable: true
	},
	prevOptions      : {
		isPreventable: true
	}
});