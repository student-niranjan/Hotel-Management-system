const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        } catch (error) {
            const statusCode = Number.isInteger(error.statusCode)
                ? error.statusCode
                : 500;

            res.status(statusCode).json({
                success: false,
                message: error.message || "Internal Server Error",
                error: error.code || null,
            });
        }
    };
};

export default asyncHandler;
