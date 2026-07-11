const errorMiddleware = (err, req, res, next) => {
    console.error("ERROR:", err);

    if (err.code === "P2002") {
        return res.status(409).json({
            success: false,
            message: "Duplicate value already exists",
        });
    }

    if (err.code === "P2025") {
        return res.status(404).json({
            success: false,
            message: "Record not found",
        });
    }

    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

export default errorMiddleware;