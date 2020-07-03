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
        const errorMessage = "deliveryRoute must be at least 3 characters " +
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
        const errorMessage = "deliveryPath must be in formats such as A-B, A-B-C, A-B-C-D and the values must be characters";
        const deliveryPath = req.query.deliveryPath;
        if (deliveryPath.length <= 1 || deliveryPath.length % 2 == 0){
            return res.status(400).json({message: errorMessage});    
        }
        let query = { $or: [] }
        let pathSize = 0;
        for (let i = 0; i < deliveryPath.length; i++) {
            if (i % 2 == 0) {
                if (!isNaN(deliveryPath[i])) {
                    return res.status(400).json({message: errorMessage});
                }
                if (i < deliveryPath.length - 2) {
                    pathSize += 1;
                    query.$or.push({
                        from_path: deliveryPath[i],
                        to_path: deliveryPath[i+2]
                    })
                }
            } else {
                if (deliveryPath[i] != '-') {
                    return res.status(400).json({message: errorMessage});
                }
            }
        }
        let findRouteByCostPromise = deliveryRouteService.findRouteByCost(query, pathSize);
        findRouteByCostPromise.then((cost) => {
            if (cost.message) {
                return res.status(400).json({message: cost.message});
            } else {
                return res.status(200).json({deliveryCost: cost});
            }
        }, (err) => {
            json_error_response.DefaultError(err, res);
        })
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

const possibleRoute = (req, res, next) => {
    try {
        let max = Number.MAX_SAFE_INTEGER;
        let deliverCost = Number.MAX_SAFE_INTEGER;
        if (req.query.maximumStop) {
            if (isNaN(req.query.maximumStop)) {
                return res.status(400).json(json_error_response.IsNotObject('maximumStop', 'Integer'));
            }
            max = parseInt(req.query.maximumStop);
        }
        if (req.query.deliveryCost) {
            if (isNaN(req.query.deliveryCost)) {
                return res.status(400).json(json_error_response.IsNotObject('deliveryCost', 'Integer'));
            }
            deliverCost = parseInt(req.query.deliveryCost);
        }
        if (!req.query.deliveryPath) {
            return res.status(400).json(json_error_response.IsRequired('deliveryPath'));
        } 
        let useDoublePath = false;
        if (req.query.useDoublePath && req.query.useDoublePath.toString() === "true") {
            useDoublePath = true;
        }
        const deliveryPath = req.query.deliveryPath;
        if (deliveryPath.length != 3 || deliveryPath[1] !== '-' || !isNaN(deliveryPath[0]) || !isNaN(deliveryPath[2])) {
            return res.status(400).json({message: "deliveryPath must be exactly 3 words in format (A-B). (A: starting destination, B: ending destination"});
        }
        possibleRoutePromise = deliveryRouteService.calculateNoOfPossibleRoutes(deliveryPath, max, deliverCost, useDoublePath);
        possibleRoutePromise.then((result) => {
            return res.json({possiblePaths: result});
        }, (err) =>  {
            json_error_response.DefaultError(err, res);
        })
    } catch(err) {
        json_error_response.DefaultError(err, res);
    }
}

const cheapestCost = (req,res, next) => {
    try {
        if (!req.query.deliveryPath) {
            return res.status(400).json(json_error_response.IsRequired('deliveryPath'));
        } 
        const deliveryPath = req.query.deliveryPath;
        if (deliveryPath.length != 3 || deliveryPath[1] !== '-' || !isNaN(deliveryPath[0]) || !isNaN(deliveryPath[2])) {
            return res.status(400).json({message: "deliveryPath must be exactly 3 words in format (A-B). (A: starting destination, B: ending destination"});
        }
        cheapestCostPromise = deliveryRouteService.calculateCheapestCost(deliveryPath);
        cheapestCostPromise.then((result) => {
            if (result >= 0) {
                return res.json({cheapestCost: result});
            } else {
                return res.status(400).json({message: "No Possible Path"});
            }
        }, (err) =>  {
            json_error_response.DefaultError(err, res);
        })
    } catch(err) {
        json_error_response.DefaultError(err, res);
    }
}

module.exports = {
    create,
    getAllRoutes,
    getRouteById,
    findCostByRoute,
    possibleRoute,
    editRoute,
    deleteRoute,
    cheapestCost
}