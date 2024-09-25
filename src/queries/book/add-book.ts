const addBookQuery = `INSERT INTO books (title, author, isbn, available_quantity, shelf_location)
VALUES ($1, $2, $3, $4, $5) RETURNING *`

export default addBookQuery