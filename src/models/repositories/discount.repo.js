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
    console.log(filter, "filter")
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

const updateDiscountByid = async ({
    discountId,
    playload,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(discountId, playload, { new: isNew })
}

const checkDiscountExits = async ({
    model, filter
}) => {
    return await model.findOne(filter).lean()
}


module.exports = {
    findAllDisCountCodeUnSelect,
    updateDiscountByid,
    findAllDisCountCodeSelect,
    checkDiscountExits
}
