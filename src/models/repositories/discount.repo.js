'use strict'

const { getUnSelectData, getSelectData } = require("../../utils")

const findAllDisCountCodeUnSelect = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter,
    unSelect,
    model
}) => {
    const skip = (page - 1) * page
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 }
    const documents = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getUnSelectData(unSelect))
        .lean()
    return documents
}

const findAllDisCountCodeSelect = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter,
    select,
    model
}) => {
    const skip = (page - 1) * page
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 }
    const documents = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return documents
}

module.exports = {
    findAllDisCountCodeUnSelect,
    findAllDisCountCodeSelect
}
