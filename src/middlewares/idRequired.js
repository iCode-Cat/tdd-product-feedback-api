module.exports.idRequired = async (req, res, next) => {
  const {id} = req.body;
  if (!id) {
    return res.status(400).json({
      error: "Id required"
    });
  }
  next();
};
