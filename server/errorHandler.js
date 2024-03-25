

const internal = "Internal server error";
const internal2 = "Duplicate key error"
const nodata = "No Content"

const errorHandler = (error,req,res,next) => {
    if (error.name === "TableCreationError") {
        return res.status(500).send({ message: error.message || internal });
    } else if (error.name === "DatabaseQueryError") {
        return res.status(400).send({ message: error.message || internal });
    } else if (error.name === "QueryError") {
        return res.status(500).send({message: error.message || internal});
    } else if(error.name === "DuplicateKeyError"){
        return res.status(409).send({message: error.message || internal2});
    } else if(error.name === "QueryResultError"){
        return res.status(204).send();
    } else {
        return res.status(500).send({ message: error.name || internal });
    }
};

module.exports = errorHandler