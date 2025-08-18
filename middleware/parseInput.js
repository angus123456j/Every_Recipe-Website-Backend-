module.exports = (req, res, next) => {
  const fieldsToParse = ["tags", "ingredients", "steps"];

  fieldsToParse.forEach((field) => {
    if (req.body[field] && typeof req.body[field] === "string") {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (err) {
        console.log("parse failed");
      }
    }
  });
  next();
};
