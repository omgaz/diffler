if (typeof TestFactory == 'undefined') { TestFactory = {}; }
 
TestFactory.testObject = {
    //empty stuff array, filled during initialization
    obj: {},
 
    init: function init() {
        this.obj = {};
    },

    add: function (key, value) {
    	this.obj[key] = value;
    },

    remove: function (key) {
    	delete this.obj[key];
    },

    isEmpty: function() {
        var l = 0;
        for (var key in this.obj) {
            if (this.obj.hasOwnProperty(key)) l++;
        }
        return l===0;
    },

    reset: function () {
        this.obj = {};
    }
};
 
TestFactory.testObject.init();