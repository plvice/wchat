const React = require('react');
const ReactDOM = require('react-dom');
const AppDispatcher = require('../dispatchers/Dispatcher');
const UserAction = require('../actions/User');
const UserStore = require('../stores/User');
const validator = require('validator');
const ChatComponent = require('./Chat');

var dragged;
var toRemove;

var List = React.createClass({
  getInitialState: function() {
    var cars = this.props.data;
    var visible = [];
    var hidden = [];

    cars.map(function (value, i){
        if (value.visible === true) {
            visible.push(value);
        } else {
            hidden.push(value);
        }
    });

    return {
        data: cars,
        visibleCars: visible,
        hiddenCars: hidden,
        currentDragIndex: null
    };
  },
  dragStart: function(e) {
    dragged = e.currentTarget;
    var index = dragged.getAttribute('data-id');

    this.setState({
        currentDragIndex: index
    });

    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires dataTransfer data to be set
    e.dataTransfer.setData("text/html", e.currentTarget);
    toRemove = dragged.parentNode;
  },
  removeObject: function(obj, name) {
    obj.map(function(value, i) {
        if (value.name === name) {
            console.log('index to remove: ' + i);
        }
    });
  },
  dragEnd: function(e) {
    var visible = this.state.visibleCars;
    var hidden = this.state.hiddenCars;
    var data = this.state.data;
    var group = placeholder.parentNode.getAttribute('data-group')
    var index = this.state.currentDragIndex;

    dragged.style.display = "block";

    if (group === 'visible') {
        console.log('moved to visible');
        hidden[index].visible = true;
        visible.push(hidden[index]);
        hidden.splice(this.state.currentDragIndex, 1);
    }

    if (group === 'hidden') {
        console.log('moved to hidden');
        visible[index].visible = false;
        hidden.push(visible[index]);
        visible.splice(this.state.currentDragIndex, 1);
    }

    placeholder.remove();

    // Update data
    data = visible.concat(hidden);

    this.setState({
        data: data,
        visibleCars: visible,
        hiddenCars: hidden
    });

    console.log(this.state);

  },
  dragOver: function(e) {
    e.preventDefault();
    dragged.style.display = "none";
    if(e.target.className == "placeholder") return;
    this.over = e.target;
    // Inside the dragOver method
    var relY = e.clientY - this.over.offsetTop;
    var height = this.over.offsetHeight / 2;
    var parent = e.target.parentNode;
    
    if(relY > height) {
      this.nodePlacement = "after";
      parent.insertBefore(placeholder, e.target.nextElementSibling);
    }
    else if(relY < height) {
      this.nodePlacement = "before"
      parent.insertBefore(placeholder, e.target);
    }
  },
  render: function() {
    return (
        <div className="lists">
        <ul id="Visible" data-group="visible" onDragOver={this.dragOver}>
            {this.state.visibleCars.map(function(item, i) {
                return (
                    <li
                        data-id={i}
                        data-name={item.name}
                        data-visible={item.visible}
                        key={i}
                        draggable="true"
                        onDragEnd={this.dragEnd}
                        onDragStart={this.dragStart}
                    > 
                        {item.name}
                </li>
                )
            }, this)}
        </ul>
        <h2>Dupa</h2>
        <ul id="Hidden" data-group="hidden" onDragOver={this.dragOver}>
            {this.state.hiddenCars.map(function(item, i) {
                return (
                    <li
                        data-id={i}
                        data-name={item.name}
                        data-visible={item.visible}
                        key={i}
                        draggable="true"
                        onDragEnd={this.dragEnd}
                        onDragStart={this.dragStart}
                    > 
                        {item.name}
                </li>
                )
            }, this)}
        </ul>
    </div>
    )
  }
});

var colors = [
    {name: "Audi", visible: true},
    {name: "Ferrari", visible: true},
    {name: "Maserati", visible: true},
    {name: "Alfa Romeo", visible: false},
    {name: "Peugeot", visible: false},
    {name: "Chevrolet", visible: false},
];

var placeholder = document.createElement("li");
placeholder.className = "placeholder";

var Login = React.createClass({
    getInitialState: function () {
        var state = UserStore.getUser();
        state.nick = 'Piotr';
        state.email = 'prawdziwypiotrek@outlook.com';
        state.waitingForLogin = false;
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
        let that = this;
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
            that.setState({
                waitingForLogin: true
            });

            setTimeout(function () {
                // that.fetchChatData();
                that.setState({
                    waitingForLogin: false
                });
                that.renderChatComponent();
                UserAction.login(that.state);
            }, 800);
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
        .catch(function (err) {
            error(err);
        });

        function success() {
            that.setState({
                waitingForLogin: false
            });
            that.renderChatComponent();
        }

        function error(err) {
            console.error('Unable to fetch data. Sorry!')
            console.error(err);
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
                    <List data={colors} />
                </div>
                <div className="ball"></div>
            </div>
        )
    }
});

module.exports = Login;

/*<form className="login__form" onSubmit={this.validateForm} noValidate>
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
                        <button type="submit" id="login" className={this.state.waitingForLogin ? 'loading' : ''}>Go to chat <span className="loader"></span></button>
                    </form>*/