export const dayTotal = services => {
	let iterationPrice = 0;
	services.forEach(service => {
		let serviceTotal = service.price * service.quantity;
		iterationPrice = iterationPrice + serviceTotal;
	});
	return iterationPrice;
};
