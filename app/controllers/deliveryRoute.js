const json_error_response = require('json_error_response');
const datetimeHelper = require('../helpers/datetime');
const deliveryRouteService = require('../services//deliveryRoute');
const camel = require('mongo_recursive_camelcase');

const create = async (req, res, next) => {
    try {
        if (!req.body.deliveryRoute) {
            return res.status(400).json(json_error_response.IsRequired('deliveryRoute'));
        }
        let errorMessage = "deliveryRoute must be at least 3 characters " +
                        "and of format AB3 (first and second (locations) " +
                        "are characters follow by number (distance cost)).";
        let deliveryRoute = req.body.deliveryRoute;
        if (deliveryRoute.length < 3 || 
            !isNaN(deliveryRoute.charAt(0)) || 
            !isNaN(deliveryRoute.charAt(1)) || 
            isNaN(deliveryRoute.substring(2,deliveryRoute.length))) {
            return res.status(400).json({message: errorMessage});
        }
        let deliveryRouteItem = {
            from_path: deliveryRoute.charAt(0),
            to_path: deliveryRoute.charAt(1),
            delivery_cost: parseInt(deliveryRoute.substring(2, deliveryRoute.length))
        }
        deliveryRouteItem = datetimeHelper.initDate(deliveryRouteItem);
        let query = {
            fromPath: deliveryRouteItem.from_path,
            toPath: deliveryRouteItem.to_path
        }
        let findPromise = deliveryRouteService.find(query);
        findPromise.then((foundRoutes) => {
            if (foundRoutes.length > 0) {
                return res.status(400).json({message: "DeliveryRoute already exists."});
            } else {
                let createPromise = deliveryRouteService.insertDeliveryRoute(deliveryRouteItem);
                createPromise.then((insertedRoute) => {
                    return res.json(camel.mongoCamel(insertedRoute));
                }, (err) => {
                    json_error_response.DefaultError(err, res);
                });
            }
        }, (err) => {
            json_error_response.DefaultError(err, res);
        })
    } catch(err) {
      json_error_response.DefaultError(err, res);  
    }
}

const getAllRoutes = async (req, res, next) => {
    return res.status(400).json(json_error_response.NotImplemented());
}

const getRouteById = async (req, res, next) => {
    return res.status(400).json(json_error_response.NotImplemented());
}

const findRoute = async (req, res, next) => {
    return res.status(400).json(json_error_response.NotImplemented());
}

const editRoute = async (req, res, next) => {
    return res.status(400).json(json_error_response.NotImplemented());
}

const deleteRoute = async (req, res, next) => {
    return res.status(400).json(json_error_response.NotImplemented());
}

module.exports = {
    create,
    getAllRoutes,
    getRouteById,
    findRoute,
    editRoute,
    deleteRoute
}