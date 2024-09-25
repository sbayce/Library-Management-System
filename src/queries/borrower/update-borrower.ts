const updateBorrowerQuery = `UPDATE borrowers SET
name = COALESCE($1, name),
email = COALESCE($2, email),
registered_date = COALESCE($3, registered_date)
WHERE id = $4 RETURNING *`

export default updateBorrowerQuery