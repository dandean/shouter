/**
 *  mixin Watchable
 *  Mixin for adding sproutcore-style property watching... kinda.
 *  todo: - examples with UI elements
 *        - investigate potential performance issues
 **/
var Shouter = {
	// Private method for getting the unique id for the object.
	_getShoutID: function() {
		if (Object.isUndefined(this._id)) {
			this._id = Object.isFunction(this.identify) ? this.identify() : "shouter-" + Math.random();
		}
		return this._id;
	},
	
	/**
	 *  Shouter#set(prop, value) -> this
	 *  Sets the property on this object to the specified value, then notifies all watchers.
	 **/
	set: function(prop, value) {
		var scope = this;
		if (arguments.length == 3) {
			scope = arguments[0]; prop = arguments[1]; value = arguments[2];
		}

		if (scope[prop] != value) {
			var was = scope[prop];
			scope[prop] = value;
			
			document.fire("shout:" + scope._getShoutID(), {
				source: scope,
				name:   prop,
				was:    was,
				is:     scope[prop]
			});
		}
		return this;
	},

	/**
	 *  Shouter#get(prop) -> object
	 *  Gets the value from the object.
	 **/
	get: function(prop) {
		return this[prop];
	}
};

/**
 *  mixin Reactor
 *  Mixin for adding "Reactor" capabilities to object.
 *  TODO: Enable application to HTML Elements.
 **/
var Reactor = {

	// Private method for getting handler which can be used with stopObserving.
	_getReactor: function() {
		if (Object.isUndefined(this._reactor)) this._reactor = this.__react.bind(this);
		return this._reactor;
	},

	// Private handler: invokes callback functions when found.
	__react: function(e) {
		var callback = this["__reactTo" + e.memo.name.charAt(0).toUpperCase() + e.memo.name.substr(1)] || this["__reactTo_$"];
		if (Object.isFunction(callback)) callback(e.memo.source, e.memo.name, e.memo.was, e.memo.is);
	},

	/**
	 *  Reactor#listen(shouter) -> this
	 *  - shouter (Shouter): The Shouter object to listen to.
	 *
	 *  Starts listening to property modification on the Shouter.
	 **/
	listen: function(shouter) {
		document.observe("shout:" + shouter._getShoutID(), this._getReactor());
		return this;
	},

	/**
	 *  Reactor#ignore(shouter) -> this
	 *  - shouter (Shouter): The Shouter object to stop listening to.
	 *
	 *  Stops listening to property modification on the Shouter.
	 **/
	ignore: function(shouter) {
		document.stopObserving("shout:" + shouter._getShoutID(), this._getReactor());
		return this;
	}
};