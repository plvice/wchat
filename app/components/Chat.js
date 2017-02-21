const React = require('react');
const ReactDOM = require('react-dom');
const AppDispatcher = require('../dispatchers/Dispatcher');
const UserAction = require('../actions/User');
const UserStore = require('../stores/User');

var Chat = React.createClass({
    getInitialState: function () {
        var user = UserStore.getUser();

        return {
            user: user
        }
    },

    componentDidMount: function () {
        this.showChat();
        this.adjustChatScroll();
    },

    componentWillUnmount: function () {

    },

    showChat: function () {
        
    },

    adjustChatScroll: function () {
        var chat = document.getElementsByClassName('chat')[0];
        chat.scrollTop = chat.scrollHeight;
    },

    render: function () {
        return (
            <div className="app">
                <section className="app__wrap">
                    <aside className="app__wrap-aside sidebar">
                        <div className="sidebar__content">
                            <div className="avatar">
                                <div className="avatar__img">
                                    <img src={this.state.user.gravatar} alt="" />
                                </div>
                            </div>
                            <div className="username">
                                {this.state.user.nick}
                            </div>
                        </div>
                    </aside>
                    <div className="app__wrap-content chat">
                        <div className="message">
                            <div className="message__top">
                                <div className="avatar">
                                    <div className="avatar__img">
                                        <img src={this.state.user.gravatar} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="message__body">
                                Super apka! Kiedy można ściągać ze sklepu Googla?
                            </div>
                            <div className="message__footer">
                                Dziś, 15:08
                            </div>
                        </div>
                        <div className="message message--important">
                            <div className="message__top">
                                <div className="avatar">
                                    <div className="avatar__img">
                                        <img src={this.state.user.gravatar} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="message__body">
                                Super apka! Kiedy można ściągać ze sklepu Googla?
                            </div>
                            <div className="message__footer">
                                Dziś, 15:08
                            </div>
                        </div>
                        <div className="message">
                            <div className="message__top">
                                <div className="avatar">
                                    <div className="avatar__img">
                                        <img src={this.state.user.gravatar} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="message__body">
                                Super apka! Kiedy można ściągać ze sklepu Googla?
                            </div>
                            <div className="message__footer">
                                Dziś, 15:08
                            </div>
                        </div>
                        <div className="message">
                            <div className="message__top">
                                <div className="avatar">
                                    <div className="avatar__img">
                                        <img src={this.state.user.gravatar} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="message__body">
                                Super apka! Kiedy można ściągać ze sklepu Googla?
                            </div>
                            <div className="message__footer">
                                Dziś, 15:08
                            </div>
                        </div>
                        <div className="message">
                            <div className="message__top">
                                <div className="avatar">
                                    <div className="avatar__img">
                                        <img src={this.state.user.gravatar} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="message__body">
                                Super apka! Kiedy można ściągać ze sklepu Googla?
                            </div>
                            <div className="message__footer">
                                Dziś, 15:08
                            </div>
                        </div>
                        <div className="message">
                            <div className="message__top">
                                <div className="avatar">
                                    <div className="avatar__img">
                                        <img src={this.state.user.gravatar} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="message__body">
                                Super apka! Kiedy można ściągać ze sklepu Googla?
                            </div>
                            <div className="message__footer">
                                Dziś, 15:08
                            </div>
                        </div>
                        <div className="message">
                            <div className="message__top">
                                <div className="avatar">
                                    <div className="avatar__img">
                                        <img src={this.state.user.gravatar} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="message__body">
                                Super apka! Kiedy można ściągać ze sklepu Googla?
                            </div>
                            <div className="message__footer">
                                Dziś, 15:08
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        )
    }
});

module.exports = Chat;
