import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

import classes from './Auth.module.css';

class Auth extends Component{
	state = {
		controls: {
			email :{
					elementType : 'input',
					elementConfig: {
						type:'email',
						placeholder:'Mail address'
					},
					value : '',
					validation: {
						required: true,
						isEmail: true
					},
					valid : false,
					touched:false
				},
			password :{
					elementType : 'input',
					elementConfig: {
						type:'password',
						placeholder:'password'
					},
					value : '',
					validation: {
						required: true,
						minLength: 6
					},
					valid : false,
					touched:false
				}
		},
		isSignup : true
	};

	componentDidMount(){
		if(!this.props.buildingBurger && this.props.authRedirectPath !== '/'){
			this.props.onSetAuthRedirectPath();
		}
	}

	inputChangedHandler = (event, controlName) => {
		const updatedControls = {
			...this.state.controls,
			[controlName]: {
				...this.state.controls[controlName],
				value: event.target.value,
				valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
				touched: true
			}
		}
		this.setState({controls: updatedControls});
	};

	checkValidity(value, rules){
		let isValid = true;

		if(rules && rules.required){
			isValid = value.trim() !== '' && isValid;
		}

		if(rules && rules.minLength){
			isValid = value.length >= rules.minLength && isValid;
		}

		if(rules && rules.maxLength){
			isValid = value.length <= rules.maxLength && isValid;
		}

		return isValid;
	};

	submitHandler = (event) =>{
		event.preventDefault();
		this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
	};

	switchAuthModeHandler = () => {
		this.setState(prevState => {
			return {
				isSignup: !prevState.isSignup
			};
		});
	};

	render(){
		const formElementsArray = [];
		for(let key in this.state.controls){
			formElementsArray.push({
				id: key,
				config: this.state.controls[key]
			});
		}
		let form = formElementsArray.map(formElement => (
			<Input 
				key={formElement.id}
				elementType={formElement.config.elementType} 
				elementConfig={formElement.config.elementConfig} 
				value={formElement.config.value}
				invalid={!formElement.config.valid}
				touched={formElement.config.touched}
				shouldValidate={formElement.config.validation}
				changed={(event) => this.inputChangedHandler(event, formElement.id)}
				/>
		));
		if(this.props.loading){
			form = <Spinner />;
		}
		let errorMessage = null;
		if(this.props.error){
			errorMessage = (
				<p style={{color:'red'}}>{this.props.error.message}</p>
			);
		}
		let authRedirect = null;
		if(this.props.isAuthenticated){
			authRedirect = <Redirect to={this.props.authRedirect} />
		}
		return (
			<div className={classes.Auth}>
				{authRedirect}
				{errorMessage}
				<form onSubmit={this.submitHandler}>
					{form}
					<Button btnType="Success">{this.state.isSignup ? 'SIGN UP' : 'LOGIN'}</Button>
				</form>
				<Button btnType="Danger" clicked={this.switchAuthModeHandler}>SWITCH TO {this.state.isSignup ? 'LOGIN' : 'SIGN UP'}</Button>
			</div>
		);
	}
};
//
const mapStateToProps = state => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		isAuthenticated: state.auth.token !== null,
		buildingBurger: state.burgerBuilder.building,
		authRedirect: state.auth.authRedirect
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onAuth: (email, password, isSignup) => dispatch(actions.auth(email,password, isSignup)),
		onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
	};
};

export default connect(mapStateToProps,mapDispatchToProps)(Auth);