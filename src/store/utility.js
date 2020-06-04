export const updateObject = (oldObj, newProps) => {
	return {
		...oldObj,
		...newProps
	}
};