import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

const purchaseBurgerSuccess = (id, orderData) => {
	return {
		type: actionTypes.PURCHASE_BURGER_SUCCESS,
		orderId: id,
		orderData: orderData
	};
};

const purchaseBurgerFail = (error) => {
	return {
		type: actionTypes.PURCHASE_BURGER_FAIL,
		error: error
	};
};

const purchaseBurgerStart = () => {
	return {
		type: actionTypes.PURCHASE_BURGER_START
	};
};

export const purchaseBurger = (orderData, token) => {
	return dispatch => {
		dispatch(purchaseBurgerStart());
		axios.post('/orders.json?auth='+token,orderData)
				.then(response => {
					dispatch(purchaseBurgerSuccess(response.data.name, orderData));
				})
				.catch(error => {
					dispatch(purchaseBurgerFail(error));
				});
	};
};

export const purchaseInit = () => {
	return {
		type: actionTypes.PURCHASE_INIT
	};
};

const fetchOrdersSuccess = (orders) => {
	//console.log(orders);
	return {
		type: actionTypes.FETCH_ORDERS_SUCCESS,
		orders: orders
	};
};

const fetchOrdersFail = (error) => {
	return {
		type: actionTypes.FETCH_ORDERS_FAIL,
		error: error
	};
};

const fetchOrdersStart = () => {
	return {
		type: actionTypes.FETCH_ORDERS_START	
	};
};

export const fetchOrders = (token) => {
	return dispatch => {
		dispatch(fetchOrdersStart());
		axios.get('./orders.json?auth='+token)
				.then(res => {
					let fetchedOrders = [];
					for(let key in res.data){
						fetchedOrders.push({
							...res.data[key],
							id: key
						});
					}
					//this.setState({loading:false, orders:fetchedOrders});
					//console.log(fetchedOrders);
					dispatch(fetchOrdersSuccess(fetchedOrders));
				})
				.catch(err => {
					//this.setState({loading:false});
					dispatch(fetchOrdersFail());
				});
	};
};