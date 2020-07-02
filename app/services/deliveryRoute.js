const db = require('../../database');
const ObjectId = require('mongodb').ObjectID;

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

const findRouteByCost = (query, size) => {
    return new Promise((resolve, reject) => {
        try {
            let deliveryRouteCollection = db.get().collection('delivery_routes');
            deliveryRouteCollection.find(query)
                .project({delivery_cost: 1})
                .toArray((err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.length != size) {
                    return resolve({message: "No Such Route"});
                } else {
                    let cost = results.map(e => e.delivery_cost).reduce((a, b) => a + b, 0);
                    return resolve(cost);
                }
            });
        } catch(err) {
            return reject(err);
        }
    });
}
module.exports = {
    insertDeliveryRoute,
    find,
    updateCost,
    deleteById,
    findRouteByCost
}