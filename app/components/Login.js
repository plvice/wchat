const React = require('react');
const ReactDOM = require('react-dom');
const AppDispatcher = require('../dispatchers/Dispatcher');
const UserAction = require('../actions/User');
const UserStore = require('../stores/User');
const validator = require('validator');

var Login = React.createClass({
    getInitialState: function () {
        return UserStore.getUser();
    },

    componentDidMount: function () {
        console.log('Login Component mounted');
        UserStore.bind('change', this.userChanged);
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
            this.renderChatComponent();
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
        var username = e.target.value;
        this.setState({
            nick: username
        });
    },

    handleAvatarChange: function (e) {
        let email = e.target.value;
        let avatar;

        if (validator.isEmail(email)) {
            avatar = 'https://www.gravatar.com/avatar/' + CryptoJS.MD5(email).toString() + '?s=100';
            this.setState({
                gravatar: avatar,
                email: email
            });
        }
    },

    userChanged: function () {
        console.log('user changed. In user store:');
        console.log(UserStore.user);
        this.setState(UserStore.getUser());
        console.log('Login component state:');
        console.log(this.state);
    },

    renderChatComponent: function () {
        console.log('render chat');
        // ReactDOM.render(<AnotherComponent />, document.getElementById('app'))
    },

    render: function () {
        return (
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
                            onChange={this.handleUsernameChange}
                            type="text"
                            placeholder="Type your name"
                            ref="username"
                            required
                        />
                    </div>
                    <div className="login__form-avatar">
                        <input
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
        )
    }
});

module.exports = Login;
