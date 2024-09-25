const deleteBorrowerQuery = `DELETE FROM borrowers WHERE id = $1 RETURNING *`

export default deleteBorrowerQuery