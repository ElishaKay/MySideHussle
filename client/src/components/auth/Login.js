import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser, sendPasswordLink } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import boom from'../../img/boom.jpg';


class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {},
      resetRequestMade: false
    };

    this.resetPassword = this.resetPassword.bind(this);
    this.sendPasswordLink = this.sendPasswordLink.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  sendPasswordLink(){
    const userData = {
                      email: this.state.email,
                      password: this.state.password
                    };

    this.props.sendPasswordLink(userData)
    this.setState({ resetRequestMade: true })

  }

  resetPassword(){
    console.log('this.state: ',this.state);
    let message = 'Are you sure you would like to reset your password? An email will be sent to ' + this.state.email; 
    
    confirmAlert({
      title: 'Reset Password',
      message: message,
      buttons: [
        {
          label: 'Yes',
          onClick: () =>
            this.sendPasswordLink()
        },
        {
          label: 'No'
        }
      ]
    })
  }

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  }

  onChange = e => {
    console.log('onChange function called');

    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, resetRequestMade } = this.state;

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">

              {resetRequestMade ? (
                <div>
                  <img src={boom} alt="boom"/>
                  <br/>
                  <h1 className="display-4 text-center">You've done it!</h1>
                  <p className="lead text-center">
                    A link to reset your password has been sent to {this.state.email}
                  </p>
                </div>
              ) : (<div>
                  
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">
                Sign in to your SideHussle account
              </p>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Email Address"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                />

                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
                
              </form>

              {!errors.password ? null : (
                 <div className="btn btn-info btn-block mt-4" > 
                    <Link onClick={this.resetPassword} to={{ search: `?reset_password_for=${this.state.email}` }} className="page-link">Reset Password</Link>
                 </div>
               )}

               </div>
              )}


            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser, sendPasswordLink })(Login);
