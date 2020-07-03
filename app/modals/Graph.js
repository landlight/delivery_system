// Rewrite and extended from this webpage: https://programmingsoup.com/article/find-all-paths-between-two-nodes

const Vertex = require('../modals/Vertex');
const e = require('express');

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
    
    // Bonus
    getAllPathsDoubleVisit(start, end, path, visited) {
        this.dfsArray = [];
        this.dfsDouble(start, end, path, visited, this.dfsArray);    
        return this.dfsArray;
    }

    dfs(currVertex, destVertex, visited, path, fullPath) {
        let vertex = this.vertices[currVertex];
        if (!vertex) {
            return fullPath;
        }
        visited.push(currVertex);
        
        if (path.includes(vertex.getData())) {
            if (this.isVisited(path, vertex.getData())) {
                path.push(vertex.getData());    
            }
        } else {
            path.push(vertex.getData());
        }
        if (currVertex == destVertex && vertex.currCost != 0) { // if currCost is 0 => ignore) {
            // Print the following line if required to see the stops
            // console.log(path, vertex.currCost);
            fullPath.push({path: path.length, cost: vertex.currCost});
        } else {
            let connection = vertex.getConnections();
            for (let i in connection) {    
                let adjItem = connection[i];
                if (this.isVisited(visited, adjItem)) {
                    this.calculateCostAndDFS(adjItem, vertex, destVertex, visited, path, fullPath);
                } 
            }
        }
        
        path.pop();
        visited.pop();
        if (path.length == 0) {
            return fullPath;
        }
    }

    // Cost for starting point
    dfsDouble(currVertex, destVertex, visited, path, fullPath) {
        let vertex = this.vertices[currVertex];
        if (!vertex) {
            return fullPath;
        }
        visited.push(currVertex);
        
        if (path.includes(vertex.getData())) {
            if (this.isDoubleVisit(path, vertex.getData())) {
                path.push(vertex.getData());    
            }
        } else {
            path.push(vertex.getData());
        }
        if (currVertex == destVertex && vertex.currCost != 0) {
            // Print the following line if required to see the stops
            // console.log(path, vertex.currCost);
            fullPath.push({path: path.length, cost: vertex.currCost});
        } 
        let connection = vertex.getConnections();
        for (let i in connection) {    
            let adjItem = connection[i];
            if (this.isDoubleVisit(visited, adjItem)) {
                this.calculateCostAndDFS(adjItem, vertex, destVertex, visited, path, fullPath, true);
            } 
        }
        path.pop();
        visited.pop();
        if (path.length == 0) {
            return fullPath;
        }
    }

    calculateCostAndDFS(adjItem, vertex, destVertex, visited, path, fullPath, double) {
        this.vertices[adjItem].setCurrCost(vertex.getCost(adjItem) + vertex.getCurrCost());
        this.count++;
        if (this.count == 3000) {
            setTimeout(() => {
                // give 5 sec to clear the stack
                this.count = 0;
                if (double) {
                    this.dfsDouble(adjItem, destVertex, visited, path, fullPath);
                } else {
                    this.dfs(adjItem, destVertex, visited, path, fullPath);
                }
                
            }, 5000);
        }
        else {
            if (double) {
                this.dfsDouble(adjItem, destVertex, visited, path, fullPath);
            } else {
                this.dfs(adjItem, destVertex, visited, path, fullPath);
            }
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

    isDoubleVisit(visited, item) {
        // console.log(visited);
        if (visited.includes(item)) {
            let previousIndex = visited.lastIndexOf(item);
            if (visited[previousIndex - 1] === visited[visited.length-1]) {
                let nextPreviousIndex = visited.lastIndexOf(item, previousIndex-1);      
                if (nextPreviousIndex != 0 && visited[nextPreviousIndex - 1] === visited[visited.length-1]) {
                    return false;
                }
            }
        }
        return true;
    }
}

module.exports = Graph;