import React, {Component} from 'react';
import {connect} from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import axios from '../../../axios-orders.js';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

import classes from './ContactData.module.css';

class ContactData extends Component{
	state = {
		orderForm:{
			name : {
				elementType : 'input',
				elementConfig: {
					type:'text',
					placeholder:'Your Name'
				},
				value : '',
				validation: {
					required: true
				},
				valid : false,
				touched:false
			},
			street : {
				elementType : 'input',
				elementConfig: {
					type:'text',
					placeholder:'Street'
				},
				value : '',
				validation: {
					required: true
				},
				valid : false,
				touched:false
			},
			zipCode: {
				elementType : 'input',
				elementConfig: {
					type:'text',
					placeholder:'Zipcode'
				},
				value : '',
				validation: {
					required: true,
					minLength:5,
					maxLength:5
				},
				valid : false,
				touched:false
			},
			country: {
				elementType : 'input',
				elementConfig: {
					type:'text',
					placeholder:'Country'
				},
				value : '',
				validation: {
					required: true
				},
				valid : false,
				touched:false
			},
			email : {
				elementType : 'input',
				elementConfig: {
					type:'email',
					placeholder:'Your Email'
				},
				value : '',
				validation: {
					required: true
				},
				valid : false,
				touched:false
			},
			deliveryMethod: {
				elementType : 'select',
				elementConfig: {
					options:[{value:'fastest',displayValue:'Fastest'},{value:'cheapest',displayValue:'Cheapest'}]
				},
				value : 'fastest',
				valid : true
			}
		},
		formIsValid : false
		//loading: false
	};

	orerHandler = (event) => {
		event.preventDefault();
		//console.log(this.props.ings);
		//this.setState({loading: true});
		const formData = {};
		for(let formElementIdentifier in this.state.orderForm){
			formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
		}
		const order = {
			ingredients : this.props.ings,
			price: this.props.price,
			orderData: formData,
			userId: this.props.userId
		};
		this.props.onOrderBurger(order, this.props.token);
		// axios.post('/orders.json',order)
		// 		.then(response => {
		// 			this.setState({loading:false , purchasing: false});
		// 			this.props.history.push("/");
		// 		})
		// 		.catch(error => {
		// 			this.setState({loading:false , purchasing: false});
		// 		});
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

	inputChangedHandler = (event, inputIdentifier) => {
		const updatedOrderForm = {...this.state.orderForm};
		const updatedFormElement = {...updatedOrderForm[inputIdentifier]};
		updatedFormElement.value = event.target.value;
		updatedFormElement.touched = true;
		updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
		updatedOrderForm[inputIdentifier] = updatedFormElement;
		let formIsValid = true;
		for(let inputIdentifier in updatedOrderForm){
			formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
		}
		this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
	};

	render(){
		const formElementsArray = [];
		for(let key in this.state.orderForm){
			formElementsArray.push({
				id: key,
				config: this.state.orderForm[key]
			});
		}
		let form = (
			<form onSubmit={this.orerHandler}>
				{formElementsArray.map(formElement => (
					<Input 
						key={formElement.id}
						elementType={formElement.config.elementType} 
						elementConfig={formElement.config.elementConfig} 
						value={formElement.config.value}
						invalid={!formElement.config.valid}
						touched={formElement.config.touched}
						shouldValidate={formElement.config.validation}
						changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
				))}
				<Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
			</form>
		);
		if(this.props.loading){
			form = <Spinner />;
		}
		return (
			<div className={classes.ContactData}>
				<h4>Enter your Contact Data</h4>
				{form}
			</div>
		);
	};

};

const mapStateToProps = state => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		loading: state.order.loading,
		token: state.auth.token,
		userId: state.auth.userId
	};
};

const mapDispatchToProps = dispatch => {
	return{
		onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));