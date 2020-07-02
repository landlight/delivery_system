const json_error_response = require('json_error_response');
const datetimeHelper = require('../helpers/datetime');
const deliveryRouteService = require('../services//deliveryRoute');
const camel = require('mongo_recursive_camelcase');
const pagingHelper = require('../helpers/paging');

const ObjectId = require('mongodb').ObjectID;

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
    try {
        let {
            pageSize
        } = pagingHelper.inputHandlerPageSize(req);
        let findPromise = deliveryRouteService.find({});
        findPromise.then((deliveryRoutes) => {
            var {
                nextPageId
            } = pagingHelper.getNextPageItem(deliveryRoutes, pageSize, "next_page_id");
            return res.json(
                pagingHelper.pageResponse(pageSize, deliveryRoutes, nextPageId)
            );
        }, (err) => {
            json_error_response.DefaultError(err, res);
        });
    } catch(err) {
        json_error_response.DefaultError(err, res);
    }
}

const getRouteById = async (req, res, next) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "id must be an ObjectID."});
        }
        let query = {id: ObjectId(req.params.id)};
        let findPromise = deliveryRouteService.find(query);
        findPromise.then((deliveryRoutes) => {
            if (deliveryRoutes.length > 0) {
                return res.json(camel.mongoCamel(deliveryRoutes[0]));
            } else {
                return res.status(400).json(json_error_response.NotFound('delivery route'));
            }
        }, (err) => {
            json_error_response.DefaultError(err, res);
        });
    } catch(err) {
        json_error_response.DefaultError(err, res);
    }
}

const findCostByRoute = async (req, res, next) => {
    try {
        if (!req.query.deliveryPath) {
            return res.status(400).json(json_error_response.IsRequired('deliveryPath'));
        }
        let errorMessage = "deliveryPath must be in formats such as A-B, A-B-C, A-B-C-D and the values must be characters";
        const deliveryPath = req.query.deliveryPath;
        if (deliveryPath.length <= 1 || deliveryPath.length % 2 == 0){
            return res.status(400).json({message: errorMessage});    
        }
        for (let i = 0; i < deliveryPath.length; i++) {
            if (i % 2 == 0) {
                if (!isNaN(deliveryPath[i])) {
                    return res.status(400).json({message: errorMessage});
                }
            } else {
                if (deliveryPath[i] != '-') {
                    return res.status(400).json({message: errorMessage});
                }
            }
        }
        return res.json({message: "Success"});
    } catch(err) {
        json_error_response.DefaultError(err, res);
    }
}

const editRoute = async (req, res, next) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "id must be an ObjectID."});
        }
        if (!req.body.deliveryCost) {
            return res.status(400).json(json_error_response.IsRequired('deliveryCost'));
        }
        if (isNaN(req.body.deliveryCost || parseInt(req.body.deliveryCost) < 0)) {
            return res.status(400).json(json_error_response.IsNotObject('deliveryCost', 'Integer'));
        }
        let id = req.params.id;
        let query = {id: ObjectId(id)};
        let findPromise = deliveryRouteService.find(query);
        findPromise.then((deliveryRoutes) => {
            if (deliveryRoutes.length > 0) {
                updatePromise = deliveryRouteService.updateCost(id, req.body.deliveryCost);
                updatePromise.then((updated) => {
                    let updatedfindPromise = deliveryRouteService.find(query);
                    updatedfindPromise.then((updatedRoute) => {
                        return res.json(camel.mongoCamel(updatedRoute[0]));
                    }, (err) => {
                        json_error_response.DefaultError(err, res);
                    })
                }, (err) => {
                    json_error_response.DefaultError(err, res);
                })
            } else {
                return res.status(400).json(json_error_response.NotFound('delivery route'));
            }
        }, (err) => {
            json_error_response.DefaultError(err, res);
        });
    } catch(err) {
        json_error_response.DefaultError(err, res);
    }
}

const deleteRoute = async (req, res, next) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "id must be an ObjectID."});
        }
        let id = req.params.id;
        let query = {id: ObjectId(id)};
        let findPromise = deliveryRouteService.find(query);
        findPromise.then((deliveryRoutes) => {
            if (deliveryRoutes.length > 0) {
                let deletePromise = deliveryRouteService.deleteById(id);
                deletePromise.then((deleted) =>{
                    return res.json(deleted);
                }, (err) => {
                    json_error_response.DefaultError(err, res);
                })
            } else {
                return res.status(400).json(json_error_response.NotFound('delivery route'));
            }
        }, (err) => {
            json_error_response.DefaultError(err, res);
        });
    } catch(err) {
        json_error_response.DefaultError(err, res);
    }
}

module.exports = {
    create,
    getAllRoutes,
    getRouteById,
    findCostByRoute,
    editRoute,
    deleteRoute
}