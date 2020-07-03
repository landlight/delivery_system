
const Vertex = require('../modals/Vertex');

class Graph {
    constructor() {
      this.vertices = {};
      this.numberOfVertices = 0;
      this.dfsArray = [];
    }
    
    add(key, data) {
        if (!this.vertices[key]) {
            this.numberOfVertices += 1;
            this.vertices[key] = new Vertex(key, data);
            return true;
        }
        return false;
    }

    addEdge(fromVertex, toVertex, weight) {
        if (this.vertices[fromVertex] && this.vertices[toVertex]) {
            this.vertices[fromVertex].connect(toVertex, weight);
            return true;
        }
        return false;
    }

    getAllPaths(start, end) {
        this.dfsArray = [];
        this.dfs(start, end, [], [], this.dfsArray);
        return this.dfsArray;
    }

    dfs(currVertex, destVertex, visited, path, fullPath) {
        let vertex = this.vertices[currVertex];
        // console.log(visited, "visited");
        visited.push(currVertex);
        
        // if (path.includes(vertex.getData())) {
        //     let previousIndex = path.indexOf(vertex.getData());
        //     if (path[previousIndex - 1] != path[path.length-1]) {
        //         path.push(vertex.getData());
        //     }
        // } else {
        path.push(vertex.getData());
        // }
        if (currVertex == destVertex) {
            console.log(path);
            fullPath.push({path: path.length, cost: vertex.currCost});
        }
        let connection = vertex.getConnections();
        for (let i in connection) {    
            let adjItem = connection[i];
            if (!visited.includes(adjItem)) {
                this.vertices[adjItem].setCurrCost(vertex.getCost(adjItem) + vertex.getCurrCost());
                this.dfs(adjItem, destVertex, visited, path, fullPath);
            }
        }
        path.pop();
        visited.pop();
        if (path.length == 0) {
            return fullPath;
        }
    }
}

module.exports = Graph;