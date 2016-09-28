const MicroEvent = require('../vendor/MicroEvent');

var UserStore = {
    user: {
        loggedIn: false,
        nick: '',
        email: '',
        gravatar: './dist/svg/avatar.svg'
    },

    getUser: function () {
        return this.user;
    }
};

MicroEvent.mixin(UserStore);

module.exports = UserStore;
