import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem';

import classes from './NavigationItems.module.css';

const navigationItems = props => (
	<ul className={classes.NavigationItems}>
		<NavigationItem link="/">Burger Builder</NavigationItem>
		{props.isAuthenticated ? <NavigationItem link="/orders">My Orders</NavigationItem> : null}
		{props.isAuthenticated
			? <NavigationItem link="/logout">LOGOUT</NavigationItem>
			: <NavigationItem link="/auth">LOGIN</NavigationItem>}
	</ul>
);

export default navigationItems;