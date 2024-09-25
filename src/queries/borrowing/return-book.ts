const returnBookQuery = `UPDATE borrowed_books SET
returned_date = $1
WHERE book_id = $2 AND borrower_id = $3
RETURNING *`

const getBorrowingQuery = `SELECT returned_date FROM borrowed_books WHERE book_id = $1 AND borrower_id = $2 AND returned_date IS NULL`

const getBookQuery = `SELECT id FROM books WHERE id = $1`

const getBorrowerQuery = `SELECT id FROM borrowers WHERE email = $1`


export { returnBookQuery, getBorrowerQuery, getBorrowingQuery, getBookQuery }