const notFound = (req, res) =>
  res.status(404).send({ message: 'Route does not exist' });

module.exports = notFound;
