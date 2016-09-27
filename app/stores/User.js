const MicroEvent = require('../vendor/MicroEvent');

var UserStore = {
    user: {
        state: 'loggedout',
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
