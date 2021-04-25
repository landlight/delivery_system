const db = require('../../database');
const ObjectId = require('mongodb').ObjectID;
const Graph = require('../modals/Graph');

const insertDeliveryRoute = async (deliveryRoute) => {
    return new Promise((resolve, reject) => {
        try { 
            let deliveryRouteCollection = db.get().collection('delivery_routes');
            deliveryRouteCollection.insertOne(deliveryRoute, (err, insertedRoute) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(insertedRoute.ops[0]);
                }
            })
        } catch (err) {
            return reject(err);
        }
    });
}

const find = (deliveryRoute) => {
    console.log("Hello");
    return new Promise((resolve, reject) => {
        try { 
            let deliveryRouteCollection = db.get().collection('delivery_routes');
            let query = {};
            if (deliveryRoute.id) {
                query._id = ObjectId(deliveryRoute.id);
            }
            if (deliveryRoute.fromPath) {
                query.from_path = deliveryRoute.fromPath;
            }
            if (deliveryRoute.toPath) {
                query.to_path = deliveryRoute.toPath;
            }
            if (deliveryRoute.deliveryCost) {
                query.delivery_cost = parseInt(deliveryRoute.deliveryCost);
            }
            deliveryRouteCollection
                .find(query)
                .toArray((err, deliveryRoutes) => {
                    if (err) {
                        return reject(err);
                    } 
                    return resolve(deliveryRoutes);
                })
        } catch (err) {
            return reject(err);
        }
    });
}

const updateCost = (id, cost) => {
    return new Promise((resolve, reject) => {
        try {
            let deliveryRouteCollection = db.get().collection('delivery_routes');
            deliveryRouteCollection.updateOne(
                {
                    _id: ObjectId(id)
                },
                {
                    $set: {
                       delivery_cost: cost
                    }
                }, 
                {
                    upsert: false
                }, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result.modifiedCount);
                }
            );
        } catch(err) {
            return reject(err);
        }
    })
}

const deleteById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            let deliveryRouteCollection = db.get().collection('delivery_routes');
            deliveryRouteCollection.updateOne(
                {
                    _id: ObjectId(id)
                }, (err, deleted) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve({message: "success"});
                }
            );
        } catch(err) {
            return reject(err);
        }
    })
}

const findRouteByCost = (query) => {
    return new Promise((resolve, reject) => {
        try {
            let deliveryRouteCollection = db.get().collection('delivery_routes');
            deliveryRouteCollection.find(query)
                .toArray((err, results) => {
                if (err) {
                    return reject(err);
                }
                let allPaths = query.$or;
                let deliveryCost = 0;
                for (var i in allPaths) {
                    let found = results.find(e => e.from_path == allPaths[i].from_path && e.to_path == allPaths[i].to_path);
                    if (!found) {
                        return resolve({message: "No Such Route"});
                    }
                    deliveryCost += found.delivery_cost;
                }
                return resolve(deliveryCost);
            });
        } catch(err) {
            return reject(err);
        }
    });
}

const calculateNoOfPossibleRoutes = (deliveryPath, maxStop, deliveryCost) => {
    return new Promise((resolve, reject) => {
        try {
            let start = deliveryPath[0];
            let end = deliveryPath[2];
            let deliveryRouteCollection = db.get().collection('delivery_routes');
            deliveryRouteCollection.find({})
                .project({
                    from_path: 1,
                    to_path: 1,
                    delivery_cost: 1
                })
                .toArray((err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    let possiblePathsArray = getPossiblePathsArray(results, start, end);
                    const possiblePaths = possiblePathsArray.filter(e => e.path-1 <= maxStop && e.cost <= deliveryCost).length;
                    return resolve(possiblePaths);
                });
        } catch(err) {
            return reject(err);
        }
    })
}

const calculateCheapestCost = (deliveryPath) => {
    return new Promise((resolve, reject) => {
        try {
            let start = deliveryPath[0];
            let end = deliveryPath[2];
            let deliveryRouteCollection = db.get().collection('delivery_routes');
            deliveryRouteCollection.find({})
                .project({
                    from_path: 1,
                    to_path: 1,
                    delivery_cost: 1
                })
                .toArray((err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    let possiblePathsArray = getPossiblePathsArray(results, start, end);
                    if (possiblePathsArray.length <= 0) {
                        return resolve(-1);
                    } else {
                        let cheapestCost = Math.min(...possiblePathsArray.map(e => e.cost));
                        return resolve(cheapestCost)
                    }
                });
        } catch(err) {
            return reject(err);
        }
    })
}

function getPossiblePathsArray(results, start, end) {
    let startingPaths = results.map(e => e.from_path);
    let destinationPaths = results.map(e => e.to_path);

    let combine = startingPaths;
    combine.concat(destinationPaths);
    let vertices = [...new Set(combine)];
    let g = new Graph();
    for (let i = 0; i < vertices.length; i++) {
        g.add(vertices[i], vertices[i]);
    }
    for (let i = 0; i < startingPaths.length; i++) {
        g.addEdge(startingPaths[i], destinationPaths[i], results[i].delivery_cost);
    }
    // Case 2.2 
    if (start == end) {
        let vertex = g.vertices[start];
        let newStartPointList = vertex.getConnections();
        let possiblePathsArray = [];
        for (let i in newStartPointList) {
            let cost = vertex.getCost(newStartPointList[i]);
            let paths = g.getAllPaths(newStartPointList[i], end);
            for (let j in paths) {
                paths[j].path = paths[j].path + 1;
                paths[j].cost = paths[j].cost + cost;
                possiblePathsArray.push(paths[j]);
            }
        }
        return possiblePathsArray;
    }
    else {
        // Case 2.1 
        return g.getAllPaths(start, end);
    }
}

module.exports = {
    insertDeliveryRoute,
    find,
    updateCost,
    deleteById,
    findRouteByCost,
    calculateNoOfPossibleRoutes,
    calculateCheapestCost
}