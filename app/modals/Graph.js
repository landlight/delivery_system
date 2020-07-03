
const Vertex = require('../modals/Vertex');

class Graph {
    constructor() {
      this.vertices = {};
      this.numberOfVertices = 0;
      this.dfsArray = [];
      this.count = 0;
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
        visited.push(currVertex);
        
        if (path.includes(vertex.getData())) {
            let previousIndex = path.indexOf(vertex.getData());
            if (path[previousIndex - 1] != path[path.length-1]) {
                path.push(vertex.getData());
            }
        } else {
            path.push(vertex.getData());
        }
        if (currVertex == destVertex) {
            if (vertex.currCost != 0) { // if currCost is 0 => ignore
                console.log(path, vertex.currCost);
                fullPath.push({path: path.length, cost: vertex.currCost});
            }
        } else {
            let connection = vertex.getConnections();
            for (let i in connection) {    
                let adjItem = connection[i];
                if (this.isVisited(visited, adjItem)) {
                    this.vertices[adjItem].setCurrCost(vertex.getCost(adjItem) + vertex.getCurrCost());
                    this.count++;
                    if (this.count == 3000) {
                        setTimeout(() => {
                            // give 5 sec to clear the stack
                            this.count = 0; 
                            this.dfs(adjItem, destVertex, visited, path, fullPath);
                        }, 5000)
                    } else {
                        this.dfs(adjItem, destVertex, visited, path, fullPath);
                    }
                }
            }
        }
        path.pop();
        visited.pop();
        if (path.length == 0) {
            return fullPath;
        }
    }

    // new logic for visited: existing path should not cross again
    isVisited(visited, item) {
        if (visited.includes(item)) {
            let previousIndex = visited.lastIndexOf(item);
            if (visited[previousIndex - 1] === visited[visited.length-1]) {
                return false;
            }
        }
        return true;
    }
}

module.exports = Graph;