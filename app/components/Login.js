const React = require('react');
const ReactDOM = require('react-dom');
const AppDispatcher = require('../dispatchers/Dispatcher');
const UserAction = require('../actions/User');
const UserStore = require('../stores/User');
const validator = require('validator');
const ChatComponent = require('./Chat');

var Login = React.createClass({
    getInitialState: function () {
        var state = UserStore.getUser();
        state.nick = 'Piotr';
        state.email = 'prawdziwypiotrek@outlook.com';

        // UserAction.restoreUserData(state);

        return state;
    },

    componentDidMount: function () {
        UserStore.bind('change', this.userHasChanged);
        this.getGravatarUrl(this.state.email);
    },

    componentWillUnmount: function () {
        UserStore.unbind('change');
    },

    validateEmail: function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    validateForm: function (e) {
        e.preventDefault();
        let inputs = this.refs; // inputs should be here
        let input, inputElement, inputType, inputValidation;
        let valid = true;
        let invalidInputs = [];

        // let's take a look at some inputs inside
        for (var i in inputs) {
            input = inputs[i];
            // is there anybody?
            if (typeof input !== 'undefined') {
                inputElement = input.nodeName.toLowerCase();
                // dude, are you input?
                if (inputElement === 'input') {
                    // ok, we have to check you
                    inputType = input.getAttribute('type');
                    inputValidation = this.validateInput(inputType, input.value);
                    // are you invalid?
                    if (!inputValidation.valid) {
                        invalidInputs.push(input);
                    }
                }
            }
        }
        // is there any invalid input?
        if (invalidInputs.length === 0) {
            UserAction.login(this.state);
            this.fetchChatData();
        }
    },

    validateInput: function (type, value) {
        let validation;
        // assume that input is valid - just for case
        let input = {
            state: 'valid',
            valid: true
        };

        // is input not empty?
        if (value === '') {
            // damn. it's empty.
            input.valid = false;
            input.state = 'empty';
        } else {
            // yeah. it's not empty
            switch (type) {
                case 'email':
                validation = validator.isEmail(value);
                if (!validation) {
                    input.valid = false;
                    input.state = 'invalidEmail';
                }
                break;

                default:
                input.state = 'nothingToCheck';
            }
        }

        return input;
    },

    handleUsernameChange: function (e) {
        let username = e.target.value;

        this.setState({
            nick: username
        });
    },

    getGravatarUrl: function (email) {
        let gravatar;

        if (validator.isEmail(email)) {
            gravatar = 'https://www.gravatar.com/avatar/' + CryptoJS.MD5(email).toString() + '?s=100';

            this.setState({
                gravatar: gravatar
            });
        }
    },

    handleAvatarChange: function (e) {
        let email = e.target.value;
        this.setState({
            email: email
        });
        this.getGravatarUrl(email);
    },

    userHasChanged: function () {
        // call this function when UserStore has been changed externally
        this.setState(UserStore.getUser());
    },

    hideLoginScreen: function () {
        document.getElementsByClassName('login')[0].classList.add('login--hidden');
        document.getElementsByClassName('ball')[0].classList.add('wrecking');

        setTimeout(function () {
            ReactDOM.unmountComponentAtNode(document.getElementById('app'));
        }, 2000);
    },

    fetchChatData: function () {
        var that = this;

        fetch('http://localhost/chat/wp-json/wp/v2/comments?parent=0', {
            method: 'get',
            headers: {
                "Accept": "application/json"
            }
        })
        .then( response => response.json() )
        .then(function (response) {
            success();
        })
        .catch(function (error) {
            error();
        });

        function success() {
            that.renderChatComponent();
        }

        function error() {
            console.error('Unable to fetch data. Sorry!')
        }
    },

    renderChatComponent: function () {
        var that = this;
        
        ReactDOM.render(<ChatComponent />, document.getElementById('chat'));

        setTimeout(function () {
            that.hideLoginScreen();
        }, 100);
    },

    render: function () {
        return (
            <div className="wrap">
                <div className="login">
                    <form className="login__form" onSubmit={this.validateForm} noValidate>
                        <div className="avatar">
                            <div className="avatar__img">
                                <img
                                    src={this.state.gravatar}
                                    alt=""
                                />
                            </div>
                        </div>
                        <div className="login__form-username">
                            <input
                                value={this.state.nick}
                                onChange={this.handleUsernameChange}
                                type="text"
                                placeholder="Type your name"
                                ref="username"
                                required
                            />
                        </div>
                        <div className="login__form-avatar">
                            <input
                                value={this.state.email}
                                onChange={this.handleAvatarChange}
                                type="email"
                                placeholder="Your Gravatar (email)"
                                ref="gravatar"
                                required
                            />
                        </div>
                        <button type="submit" id="login">Go to chat</button>
                    </form>
                </div>
                <div className="ball"></div>
            </div>
        )
    }
});

module.exports = Login;
