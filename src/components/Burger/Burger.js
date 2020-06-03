import React from 'react';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

import classes from './Burger.module.css';

const burger = props => {

	let ingredientsArray = Object.keys(props.ingredients)
		.map(ing => {
			return [...Array(props.ingredients[ing])].map((_,i) => {
				return <BurgerIngredient key={ing+i} type={ing}/>;
			});
		})
		.reduce((arr,el) => {
			return arr.concat(el);
		}, []);
	if(ingredientsArray.length === 0){
		ingredientsArray = <p>Please start adding Ingredients!</p>;
	}
	return ( 
		<div className={classes.Burger}>
			<BurgerIngredient type="bread-top"/>
			{ingredientsArray}
			<BurgerIngredient type="bread-bottom"/>
		</div>
	);
};

export default burger;