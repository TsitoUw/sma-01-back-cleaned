const created = (data = "created") => {
  return { status: 201, data: data };
};

const success = (data = "succes") => {
  return { status: 200, data: data };
};

const errServer = (error = "internal server error") => {
  return { status: 500, error: error };
};

const errException = (error = "invalid informations given") => {
  return { status: 417, error: error };
};

const errNotFound = (error = "not found") => {
  return { status: 404, error: error };
};

const errFailed = (error) => {
  return { status: 400, error: error };
};

const errUnauthorized = (error = "not authorized do the action") => {
  return { status: 403, error: error };
};

module.exports = { created, success, errServer, errException, errNotFound, errFailed, errUnauthorized };
