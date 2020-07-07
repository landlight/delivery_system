class Vertex {
    constructor(key, data) {
        this.adjacencyList = {};
        this.key = key;
        this.data = data;
        this.currCost = 0;
        this.lastCurrCost = 0;
    }
    
    connect(otherVertex, weight) {
        this.adjacencyList[otherVertex] = weight;
    }

    getConnections() {
        return Object.keys(this.adjacencyList);
    }

    getCost(vertex) {
        return this.adjacencyList[vertex];
    }

    getCurrCost() {
        return this.currCost;
    }
    
    setCurrCost(cost) {
        this.currCost = cost
    }

    getData() {
        return this.data;
    }

    getLastCurrCost() {
        return this.lastCurrCost;
    }

    setLastCurrCost(lastCurrCost) {
        this.lastCurrCost = lastCurrCost;
    }
}


module.exports = Vertex;