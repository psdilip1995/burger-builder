import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
	salad   : 0.5,
	cheese  : 0.4,
	meat	: 1.3,
	bacon	: 0.7
};

class BurgerBuilder extends Component{

	state = {
		ingredients : null,
		totalPrice : 4,
		purchasable: false,
		purchasing: false,
		loading: false,
		error : false
	};

	componentDidMount(){
		axios.get('https://react-burger-builder-c9bc0.firebaseio.com/ingredients.json')
				.then(response => {
					this.setState({ingredients: response.data});
				})
				.catch(error => {
					this.setState({error: true});
				});
	}

	updatePurchaseState(ingredients){
		//const ingredients = {...this.state.ingredients};
		const sum = Object.keys(ingredients)
			.map(ing => {
				return ingredients[ing];
			})
			.reduce((sum, el)=>{
				return sum+el;
			},0);
		this.setState({purchasable: sum >0 });
	};

	purchaseHandler = () => {
		this.setState({purchasing:true});
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
		const queryParam = [];
		for(let i in this.state.ingredients){
			queryParam.push(encodeURIComponent(i)+'='+encodeURIComponent(this.state.ingredients[i]));
		}
		queryParam.push('price='+this.state.totalPrice.toFixed(2));
		this.props.history.push({
			pathname : '/checkout',
			search: '?'+queryParam.join('&')
		});
	};

	addIngredientHandler = type => {
		const oldCount = this.state.ingredients[type];
		const newCount = oldCount + 1;
		const newIngredients ={...this.state.ingredients};
		newIngredients[type] = newCount;
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice + INGREDIENT_PRICES[type];
		this.setState({
			ingredients : newIngredients,
			totalPrice	: newPrice
		});
		this.updatePurchaseState(newIngredients);
	};

	removeIngredientHandler = type => {
		const oldCount = this.state.ingredients[type];
		if(oldCount > 0){
			const newCount = oldCount - 1;
			const newIngredients ={...this.state.ingredients};
			newIngredients[type] = newCount;
			const oldPrice = this.state.totalPrice;
			const newPrice = oldPrice - INGREDIENT_PRICES[type];
			this.setState({
				ingredients : newIngredients,
				totalPrice	: newPrice
			});
			this.updatePurchaseState(newIngredients);
		}
	};

	render(){
		const disabledInfo ={...this.state.ingredients };
		for(let key in disabledInfo){
			disabledInfo[key] = disabledInfo[key] < 1;
		}
		let orderSummary = null;
		let burger = this.state.error ? <p>There is a problem!<br/>Ingredients are not loaded</p> : <Spinner /> ;
		if(this.state.ingredients){
			burger = (
				<Aux>
					<Burger ingredients = {this.state.ingredients}/>
			 		<BuildControls 
			 			ingredientAdded = {this.addIngredientHandler}
			 			ingredientRemove= {this.removeIngredientHandler}
			 			disabled = {disabledInfo}
			 			purchasable = {this.state.purchasable}
			 			ordered = {this.purchaseHandler}
			 			price = {this.state.totalPrice}/>
				</Aux>
			);
			orderSummary = <OrderSummary 
			 				ingredients={this.state.ingredients} 
			 				price={this.state.totalPrice}
			 				purchaseCancel={this.purchaseCancelHandler} 
			 				purchaseContinue={this.purchaseContinueHandler}/>;
		}
		if(this.state.loading){
			orderSummary = <Spinner />;
		}
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

export default withErrorHandler(BurgerBuilder, axios);
