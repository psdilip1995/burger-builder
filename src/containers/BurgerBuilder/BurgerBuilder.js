import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';

import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

// const INGREDIENT_PRICES = {
// 	salad   : 0.5,
// 	cheese  : 0.4,
// 	meat	: 1.3,
// 	bacon	: 0.7
// };

class BurgerBuilder extends Component{

	state = {
		//ingredients : null,
		//totalPrice : 4,
		purchasable: false,
		purchasing: false,
		//loading: false,
		//error : false
	};

	componentDidMount(){
		// axios.get('https://react-burger-builder-c9bc0.firebaseio.com/ingredients.json')
		// 		.then(response => {
		// 			this.setState({ingredients: response.data});
		// 		})
		// 		.catch(error => {
		// 			this.setState({error: true});
		// 		});
		this.props.onInitIngredients();
	}

	updatePurchaseState(ingredients){
		//const ingredients = {...this.state.ingredients};
		//const sum = Object.keys(ingredients)
		const sum = Object.keys(ingredients)
			.map(ing => {
				return ingredients[ing];
			})
			.reduce((sum, el)=>{
				return sum+el;
			},0);
		//this.setState({purchasable: sum >0 });
		return sum > 0;
	};

	purchaseHandler = () => {
		if(this.props.isAuthenticated){
			this.setState({purchasing:true});
		}else{
			this.props.onSetAuthRedirectPath("/checkout");
			this.props.history.push("/auth");
		}
	};

	purchaseCancelHandler = () => {
		this.setState({purchasing:false});
	};

	purchaseContinueHandler = () => {
		console.log(this.props);
		//alert("Order Placed Successfully!");
		//this.setState({loading: true});
		// const order = {
		// 	ingredients : this.state.ingredients,
		// 	price: this.state.totalPrice.toFixed(2),
		// 	customer: {
		// 		name : 'Sam',
		// 		address : {
		// 			street : 'Mellive',
		// 			zipCode: '11298',
		// 			country: 'USA'
		// 		},
		// 		email : 'test@test.com'
		// 	},
		// 	deliveryMethod: 'fast'
		// };
		// axios.post('/orders.json',order)
		// 		.then(response => {
		// 			this.setState({loading:false , purchasing: false});
		// 		})
		// 		.catch(error => {
		// 			this.setState({loading:false , purchasing: false});
		// 		});
		//this.props.history.push('/checkout');
		// const queryParam = [];
		// for(let i in this.state.ingredients){
		// 	queryParam.push(encodeURIComponent(i)+'='+encodeURIComponent(this.state.ingredients[i]));
		// }
		// //queryParam.push('price='+this.state.totalPrice.toFixed(2));
		// queryParam.push('price='+this.props.price.toFixed(2));
		// this.props.history.push({
		// 	pathname : '/checkout',
		// 	search: '?'+queryParam.join('&')
		// });
		this.props.onInitPurchase();
		this.props.history.push('./checkout');
	};

	// addIngredientHandler = type => {
	// 	const oldCount = this.state.ingredients[type];
	// 	const newCount = oldCount + 1;
	// 	const newIngredients ={...this.state.ingredients};
	// 	newIngredients[type] = newCount;
	// 	const oldPrice = this.state.totalPrice;
	// 	const newPrice = oldPrice + INGREDIENT_PRICES[type];
	// 	this.setState({
	// 		ingredients : newIngredients,
	// 		totalPrice	: newPrice
	// 	});
	// 	this.updatePurchaseState(newIngredients);
	// };

	// removeIngredientHandler = type => {
	// 	const oldCount = this.state.ingredients[type];
	// 	if(oldCount > 0){
	// 		const newCount = oldCount - 1;
	// 		const newIngredients ={...this.state.ingredients};
	// 		newIngredients[type] = newCount;
	// 		const oldPrice = this.state.totalPrice;
	// 		const newPrice = oldPrice - INGREDIENT_PRICES[type];
	// 		this.setState({
	// 			ingredients : newIngredients,
	// 			totalPrice	: newPrice
	// 		});
	// 		this.updatePurchaseState(newIngredients);
	// 	}
	// };

	render(){
		const disabledInfo ={
			//...this.state.ingredients 
			...this.props.ings
		};
		for(let key in disabledInfo){
			disabledInfo[key] = disabledInfo[key] < 1;
		}
		let orderSummary = null;
		let burger = this.props.error ? <p>There is a problem!<br/>Ingredients are not loaded</p> : <Spinner /> ;
		//if(this.state.ingredients){
		if(this.props.ings){
			burger = (
				<Aux>
					<Burger ingredients = {this.props.ings}/>
			 		<BuildControls 
			 			ingredientAdded = {this.props.onIngredientAdd}
			 			ingredientRemove= {this.props.onIngredientRemove}
			 			disabled = {disabledInfo}
			 			purchasable = {this.updatePurchaseState(this.props.ings)}
			 			ordered = {this.purchaseHandler}
			 			isAuth = {this.props.isAuthenticated}
			 			price = {this.props.price}/>
				</Aux>
			);
			orderSummary = <OrderSummary 
			 				ingredients={this.props.ings} 
			 				price={this.props.price}
			 				purchaseCancel={this.purchaseCancelHandler} 
			 				purchaseContinue={this.purchaseContinueHandler}/>;
		}
		// if(this.state.loading){
		// 	orderSummary = <Spinner />;
		// }
		return(
		 	<Aux>
		 		<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
		 			{orderSummary}
		 		</Modal>
		 		{burger}
		 	</Aux>
		);
	}
};

const mapStateToProps = state => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuthenticated: state.auth.token !== null
	};
};
const mapDispatchToProps = dispatch => {
	//alert(actionTypes.ADD_INGREDIENT);
	return {
		onIngredientAdd : (ingName) => dispatch(actions.addIngredient(ingName)),
		onIngredientRemove : (ingName) => dispatch(actions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(actions.initIngredients()),
		onInitPurchase: () => dispatch(actions.purchaseInit()),
		onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
	};
};



export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));

