const isValidEmail = (email) => {
	const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

	if (!email) return false;

	if (email.match(validEmailRegex)) return true;
	else return false;
};

const isValidPassword = (password) => {
	//Minimum eight characters, at least one letter and one number (maybe we will use this later)
	// const validPassowrdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

	//  ** Minimum eight characters, should not have space at the beginning and at the end **
	if (!password) return false;

	password = password.trim();
	if (password.length < 8) return false;
	else return true;
};

const isValidName = (name) => {
	if (!name) return false;
	if (name.trim().length < 3 || name.trim() == "" || name.trim().length > 50) return false;
	return true;
};

module.exports = { isValidEmail, isValidPassword, isValidName };
