const React = require('react');
const ReactDOM = require('react-dom');

var Login = React.createClass({
    getInitialState: function () {
        return {
            avatar: './dist/svg/avatar.svg'
        }
    },

    componentDidMount: function () {
        console.log('mounted');
    },

    validateEmail: function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    handleAvatarChange: function (e) {
        var avatar = e.target.value;

        if (this.validateEmail(avatar)) {
            avatar = 'https://www.gravatar.com/avatar/' + CryptoJS.MD5(avatar).toString() + '?s=100';
            this.setState({
                avatar: avatar
            });
        }
    },

    render: function () {
        return (
            <div className="login">
                <form className="login__form">
                    <div className="avatar">
                        <div className="avatar__img">
                            <img
                                src={this.state.avatar}
                                alt=""
                            />
                        </div>
                    </div>
                    <div className="login__form-username">
                        <input
                            type="text"
                            placeholder="Type your name"
                            required
                            pattern=".*\S.*"
                        />
                    </div>
                    <div className="login__form-avatar">
                        <input
                            onChange={this.handleAvatarChange}
                            type="text"
                            placeholder="Your Gravatar (email)"
                            required
                            pattern=".*\S.*"
                        />
                    </div>
                    <button type="submit" id="login">Go to chat</button>
                </form>
            </div>
        )
    }
});

module.exports = Login;
