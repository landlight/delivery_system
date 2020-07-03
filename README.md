# eko delivery_system

## Prerequisites
- install mongodb  (https://docs.mongodb.com/manual/administration/install-community/)
- install node 
- npm install

## START
- npm run start

## TEST
- npm run test
- npm run test1 (test cases for case 1)
- npm run test23 (test cases for case 3)

### Status Codes
200 - Success

400 - Bad Request

404 - Not Found

500 - Internal Server Error

## API LIST

## POSTMAN LINK - https://www.getpostman.com/collections/a344131f8da3e0ae173d

### Create Delivery Route
- POST /api/deliveryRoute/
  
  ### Input BODY (JSON Object)
  ```
  {
    "deliveryRoute": "CD3"
  }
  ```

  ### Success
  Status Code: 200
  Result : DeliverRouteObject
  ```
  {
    "fromPath": "C",
    "toPath": "D",
    "deliveryCost": 3,
    "createdAt": "2020-06-30T16:28:23.247Z",
    "updatedAt": "2020-06-30T16:28:23.247Z",
    "id": "5efb6827eeb79261e8f9660f"
  }
  ```

### FindAll Delivery Route
- GET /api/deliveryRoute/
  
  ### Input query
  size: Int

  ### Success
  Status Code: 200
  Result : Array of DeliverRouteObject with pagingInfo
  ```
  {
    "pageInformation": {
        "size": 20,
        "numberOfItems": 2
    },
    "entities": [
    ]
  }
  ```

### FindById Delivery Route
- GET /api/deliveryRoute/{id} (ObjectID)
  
  ### Input query
  params: id

  ### Success
  Status Code: 200
  Result : DeliverRouteObject
  ```
  {
    "fromPath": "C",
    "toPath": "D",
    "deliveryCost": 3,
    "createdAt": "2020-06-30T16:28:23.247Z",
    "updatedAt": "2020-06-30T16:28:23.247Z",
    "id": "5efb6827eeb79261e8f9660f"
  }
  ```

### UpdateById Delivery Route
- PUT /api/deliveryRoute/{id} (ObjectID)
  
  ### Input query
  params: id

  ### Input body
  ```
  {
    "deliveryCost": 5
  }
  ```

  ### Success
  Status Code: 200
  Result : DeliverRouteObject
  ```
  {
    "fromPath": "C",
    "toPath": "D",
    "deliveryCost": 5,
    "createdAt": "2020-06-30T16:28:23.247Z",
    "updatedAt": "2020-06-30T16:28:23.247Z",
    "id": "5efb6827eeb79261e8f9660f"
  }
  ```

### DeleteById Delivery Route
- DELETE /api/deliveryRoute/{id} (ObjectID)
  
  ### Input query
  params: id

  ### Success
  Status Code: 200
  Result : Success Object
  ```
  {
    "message": "Success"
  }
  ```

### FindCostByRoute (CASE 1)
- GET /api/deliveryRoute/findCostByRoute
  
  ### Input query
  { "deliveryPath": "A-B-C"} 

  ### Success
  Status Code: 200
  Result : Success => Delivery Cost
  ```
  {
    "deliveryCost": 8
  }
  ```
 
### FindPossible Paths (CASE 2)
- GET /api/deliveryRoute/possibleRoute
  
  ### Input query
  ```
  { 
    "deliveryPath": "E-D", (REQUIRED)
    "maximumStop": 4, (OPTIONAL => default MAX INT)
    "deliveryCost": 10 (OPTIONAL => default MAX INT)
  } 
  ```

  ### Success
  Status Code: 200
  Result : Success => Possible Paths
  ```
  {
    "possiblePaths": 4
  }
  ```

### Find CheapestCost (CASE 3)
- GET /api/deliveryRoute/cheapestCost
  
  ### Input query
  ```
  { 
    "deliveryPath": "E-D", (REQUIRED)
  } 
  ```

  ### Success
  Status Code: 200
  Result : Success => Possible Paths
  ```
  {
    "cheapestCost": 9
  }
  ```