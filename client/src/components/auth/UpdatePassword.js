import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { updatePassword } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';

class UpdatePassword extends Component {
  constructor() {
    super();
    this.state = {
      password: '',
      password2: '',
      uuid: '',
      errors: {}
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }  
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();
    console.log('ran onSubmit function')
    
    const params = new URLSearchParams(window.location.search);
    const uuid = params.get('uuid') || 'nouuidfound';

    let {password, password2} = this.state;

    if(password === password2){
      this.props.updatePassword(password, uuid, this.props.history)      
    } else{
      this.setState({errors:{password2:`passwords don't match up 😒`}})
    }

  }

  render() {
    const { errors } = this.state;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Update Password</h1>
              <p className="lead text-center">
                Forgot your SideHussle password, eh? No worries, you can update it below:
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <TextFieldGroup
                  placeholder="Confirm Password"
                  name="password2"
                  type="password"
                  value={this.state.password2}
                  onChange={this.onChange}
                  error={errors.password2}
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UpdatePassword.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { updatePassword })(withRouter(UpdatePassword));
