export const findServiceIndexByName = (name, services) => {
	return services.findIndex(service => service.name === name);
};
