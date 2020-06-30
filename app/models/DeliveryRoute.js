const DeliveryRouteModel = {
    fromPath: '',
    toPath: '',
    deliveryCost: 0,
}

const get = () => {
    return DeliveryRouteModel;
}

const deliveryRouteResponse = (deliveryRoute) => {
    return deliveryRoute;
}

module.exports = {
    get,
    deliveryRouteResponse
}