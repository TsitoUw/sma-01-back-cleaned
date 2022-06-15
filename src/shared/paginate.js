const status = require("./status");

const paginateResult = async (req, model, populate = null, filter = {}) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 8;
	let sorting = req.query.sort=="asc" || req.query.sort=="desc" ? req.query.sort : "asc"
	
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;

	const result = {};
	result.limit = limit;

	try {
		result.length = await model.countDocuments(filter);
	} catch (error) {
		status.errServer();
	}

	if (endIndex < result.length) {
		result.nextPage = page + 1;
	}

	if (startIndex > 0) {
		result.prevPage = page - 1;
	}

	try {
		result.data = await model.find(filter).sort({createdAt : sorting}).populate(populate).limit(limit).skip(startIndex); 
	} catch (error) {
		return status.errServer();
	}

	if (!result.data) return status.success("succes, no data found");
	
	return { status: 200, ...result };
};

module.exports = { paginateResult };
