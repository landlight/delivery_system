const json_error_response = require('json_error_response');

const create = async (req, res, next) => {
    return res.status(400).json(json_error_response.NotImplemented());
}

const getAllRoutes = async (req, res, next) => {
    return res.status(400).json(json_error_response.NotImplemented());
}

const getRouteById = async (req, res, next) => {
    return res.status(400).json(json_error_response.NotImplemented());
}

const findRoute = async (req, res, next) => {
    return res.status(400).json(json_error_response.NotImplemented());
}

const editRoute = async (req, res, next) => {
    return res.status(400).json(json_error_response.NotImplemented());
}

const deleteRoute = async (req, res, next) => {
    return res.status(400).json(json_error_response.NotImplemented());
}

module.exports = {
    create,
    getAllRoutes,
    getRouteById,
    findRoute,
    editRoute,
    deleteRoute
}