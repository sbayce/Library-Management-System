const registerBorrowerQuery = `INSERT INTO borrowers (name, email, registered_date)
VALUES ($1, $2, $3) RETURNING *`

export default registerBorrowerQuery