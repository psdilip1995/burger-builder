import React, {Component} from 'react';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders.js';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Orders extends Component{
	state = {
		orders : [],
		loading: true
	}

	componentDidMount(){
		axios.get('./orders.json')
				.then(res => {
					//console.log(res.data);
					let fetchedOrders = [];
					for(let key in res.data){
						fetchedOrders.push({
							...res.data[key],
							id: key
						});
					}
					this.setState({loading:false, orders:fetchedOrders});
				})
				.catch(err => {
					this.setState({loading:false});
				});
	}

	render() {
		let ordersDetails = <Spinner />;
		if(!this.state.loading){
			ordersDetails = this.state.orders.map(order => {
				return <Order 
							key={order.id}
							ingredients={order.ingredients}
							price={order.price}/>;
			});
		}
		return (
			<div>
				{ordersDetails}
			</div>
		);
	};
};

export default withErrorHandler( Orders, axios);