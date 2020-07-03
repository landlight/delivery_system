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
                    let possiblePathsArray = g.getAllPaths(start, end);
                    const possiblePaths = possiblePathsArray.filter(e => e.path <= maxStop && e.cost <= deliveryCost).length;
                    return resolve(possiblePaths);
                });
        } catch(err) {
            return reject(err);
        }
    })
}

function dfs(startingNode){
    let visited = this.createVisitedObject();
    this.dfsHelper(startingNode, visited);
}
  
function dfsHelper(startingNode, visited){
    visited[startingNode] = true;
    console.log(startingNode);
  
    let arr = this.AdjList.get(startingNode);
  
    for(let elem of arr){
      if(!visited[elem]){
        this.dfsHelper(elem, visited);
      }
    }
}
module.exports = {
    insertDeliveryRoute,
    find,
    updateCost,
    deleteById,
    findRouteByCost,
    calculateNoOfPossibleRoutes
}

//  TEST 
 // g.add("A", "A")
// g.add("B", "B")
// g.add("C", "C")
// g.add("D", "D")
// g.add("E", "E")
// g.add("F", "F")

// g.addEdge("A", "B", 1)
// g.addEdge("B", "E", 1)
// g.addEdge("E", "F", 0.5)

// g.addEdge("B", "F", 2)

// g.addEdge("A", "C", 1)
// g.addEdge("C", "F", 3)

// g.addEdge("A", "D", 1)
// g.addEdge("D", "F", 4)

// g.getAllPaths("A", "F");