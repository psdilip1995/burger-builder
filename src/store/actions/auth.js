import * as actionTypes from './actionTypes';
import axios from 'axios';

const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	};
};

const authSuccess = (token, userId) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken: token,
		userId: userId
	};
};

const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAIL,
		error: error
	};
};

export const logout = () => {
	localStorage.removeItem('burger_token');
	localStorage.removeItem('burger_expirationDate');
	localStorage.removeItem('burger_userId');
	return {
		type: actionTypes.AUTH_LOGOUT
	};
};

const checkAuthTimeout = expirationTime => {
	return dispatch => {
		setTimeout(()=>{
			dispatch(logout());
		}, expirationTime*1000);
	};
};

export const setAuthRedirectPath = path => {
	return {
		type: actionTypes.SET_AUTH_REDIRECT_PATH,
		path: path
	}
};

export const auth = (email, password, isSignup) => {
	return dispatch => {
		dispatch(authStart());
		const authData = {
			email: email,
			password: password,
			returnSecureToken: true
		};
		let url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAvUZwutUySwG49xysXGA0bkiQlloUxK18";
		if(!isSignup){
			url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAvUZwutUySwG49xysXGA0bkiQlloUxK18";
		}
		axios.post(url, authData)
			.then(response => {
				console.log(response);
				const expirationDate = new Date(new Date().getTime() + response.data.expiresIn*1000);
				localStorage.setItem('burger_token',response.data.idToken);
				localStorage.setItem('burger_expirationDate', expirationDate);
				localStorage.setItem('burger_userId',response.data.localId);
				dispatch(authSuccess(response.data.idToken, response.data.localId));
				dispatch(checkAuthTimeout(response.data.expiresIn));
			}).catch(error => {
				console.log(error);
				dispatch(authFail(error.response.data.error));
			});
	};
};

export const authCheckStatus = () => {
	//alert(localStorage.getItem('burger_token'));
	return dispatch => {
		const token = localStorage.getItem('burger_token');
		if(!token){
			dispatch(logout());
		}else{
			const expirationDate = new Date(localStorage.getItem('burger_expirationDate'));
			if(expirationDate > new Date()){
				const userId = localStorage.getItem('burger_userId');
				dispatch(authSuccess(token, userId));
				dispatch(checkAuthTimeout((expirationDate.getTime()-new Date().getTime())/1000));
			}else{
				alert('test123');
				dispatch(logout());
			}
		}
	};
};