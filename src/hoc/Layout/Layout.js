import React, {Component} from 'react';
import Aux from '../Aux/Aux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import {connect} from 'react-redux';

import classes from './Layout.module.css';

class Layout extends Component {
	state = {
		showSideDrawer : false
	};

	sideDrawerClosedHandler = () => {
		this.setState({showSideDrawer:false});
	};

	sideDrawerOpenHandler = () => {
		this.setState({showSideDrawer:true});
	};

	sideDrawerToggleHandler = () => {
		this.setState((prevState) => {
			return {showSideDrawer: !prevState.showSideDrawer}
		});
	};

	render() {
		return	<Aux>
					<Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} isAuth={this.props.isAuthenticated} />
					<SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerClosedHandler} isAuth={this.props.isAuthenticated}/>
					<main className={classes.Content}>
						{this.props.children}
					</main>
				</Aux>
	}
};

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.token !== null
	};
};

export default connect(mapStateToProps)(Layout);