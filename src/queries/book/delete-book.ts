const deleteBookQuery = `DELETE FROM books WHERE id = $1 RETURNING *`

export default deleteBookQuery