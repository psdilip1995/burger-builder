import React from 'react';

import classes from './Input.module.css';

const input = props => {
	let inputElement = null;
	let inputClasses = [classes.InputElement];
	let validationError = null;

	if(props.invalid && props.shouldValidate && props.touched){
		inputClasses.push(classes.Invalid);
		validationError = <span style={{color:'red'}}>Please Enter a valid value!</span>;
	}

	switch(props.elementType){
		case ('input'):
			inputElement = <input 
								className={inputClasses.join(' ')} 
								{...props.elementConfig} 
								onChange = {props.changed}
								value={props.value}/>;
			break;
		case ('textarea'):
			inputElement = <textarea 
								className={inputClasses.join(' ')} 
								{...props.elementConfig}
								onChange = {props.changed}
								value={props.value}/>;
			break;
		case ('select'):
			inputElement = (
							<select className={inputClasses.join(' ')} value={props.value} onChange = {props.changed}>
								{props.elementConfig.options.map(option => {
									return <option key={option.value} value={option.value}>{option.displayValue}</option>;
								})}
							</select>
							);
			break;
		default:
			inputElement = <input 
								className={inputClasses.join(' ')} 
								{...props.elementConfig}
								onChange = {props.changed}
								value={props.value}/>;
	};

	return (
		<div className={classes.Input}>
			<label className={classes.Label}>{props.label}</label>
			{inputElement}
			{validationError}
		</div>
	);
};

export default input;