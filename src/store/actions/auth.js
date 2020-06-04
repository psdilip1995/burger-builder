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
	return {
		type: actionTypes.AUTH_LOGOUT
	};
};

const checkAuthTimeout = expirationTime => {
	return dispatch => {
		setTimeout(()=>{
			dispatch(logout());
		}, expirationTime*500);
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
				dispatch(authSuccess(response.data.idToken, response.data.localId));
				dispatch(checkAuthTimeout(response.data.expiresIn));
			}).catch(error => {
				console.log(error);
				dispatch(authFail(error.response.data.error));
			});
	};
};