# eko delivery_system

## Prerequisites

- install mongodb 
- install node 
- npm install

## START
- npm run start

## TEST
- npm run test

### Status Codes
200 - Success

400 - Bad Request

404 - Not Found

500 - Internal Server Error

## API LIST
### Create Delivery Route
- POST /api/deliveryRoute/
  
  ### Input BODY (JSON Object)
  { "deliveryRoute" : "CD3" }

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

