var camel = require('mongo_recursive_camelcase');

function pageResponse(pageSize, result, nextPageId) {
    return {
        pageInformation: {
            size: pageSize,
            numberOfItems: result.length,
            nextPageId
        },
        entities: camel.mongoCamel(result)
    };
}

function camelCase(items){
    return camel.mongoCamel(items);
}

//comparison = 1 => greater than, comparison = 0 => less than
function inputHandlerDatePageSize(req) {
    let fromDate = new Date(req.query.fromDate);
    let toDate = new Date(req.query.toDate);
    let pageSize = req.query.size ? parseInt(req.query.size) : parseInt(process.env.DEFAULT_PAGE_SIZE);
    return {
        fromDate,
        toDate,
        pageSize
    };
}

function inputHandlerDatePage(req) {
    let pageSize = req.query.size ? parseInt(req.query.size) : parseInt(process.env.DEFAULT_PAGE_SIZE);
    let nextPage = req.query.nextPageId ? req.query.nextPageId : -1;
    let fromDate = new Date(req.query.fromDate);
    let toDate = new Date(req.query.toDate);
    return {
        fromDate,
        toDate,
        nextPage,
        pageSize
    };
}

function inputHandlerPageSize(req) {
    let pageSize = req.query.size ? parseInt(req.query.size) : parseInt(process.env.DEFAULT_PAGE_SIZE);
    return {
        pageSize
    };
}

function getNextPageId(result, pageSize) {
    return getNextPageItem(result, pageSize, "_id");
}

function getNextPageIdDate(result, pageSize) {
    return getNextPageItem(result, pageSize, "created_at");
}

function getNextPageItem(result, pageSize, item) {
    let nextPageId;
    if (result.length == 0) {
        return { nextPageId };
    }
    if (result.length >= pageSize) {
        nextPageId = result[result.length - 1][item];
    }
    return {
        nextPageId
    };
}

module.exports = {
    pageResponse,
    inputHandlerPageSize,
    inputHandlerDatePage,
    inputHandlerDatePageSize,
    getNextPageId,
    getNextPageIdDate,
    getNextPageItem,
    camelCase,
}