import React from 'react';
import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button';

const orderSummary = props => {
	const ingredientSummary = Object.keys(props.ingredients)
		.map(ing => {
			return (
				<li key={ing}>
					<span style={{textTransform:'capitalize'}}> {ing} </span> : {props.ingredients[ing]}
				</li>
				);
		});
	 return (
	 	<Aux>
	 		<h3>Your Order</h3>
	 		<p>Delicious Burger with following ingredients :</p>
	 		<ul>
	 			{ingredientSummary}
	 		</ul>
	 		<p>Total Price : <strong>{props.price.toFixed(2)}</strong></p>
	 		<p>Continue to Checkout?</p>
	 		<Button btnType="Danger" clicked={props.purchaseCancel}>CANCEL</Button>
	 		<Button btnType="Success" clicked={props.purchaseContinue}>ORDER</Button>
	 	</Aux>
	 );
};

export default orderSummary;