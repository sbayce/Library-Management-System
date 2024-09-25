const checkoutBookQuery = `INSERT INTO borrowed_books (book_id, borrower_id, checkout_date, due_date)
VALUES ($1, $2, $3, $4) RETURNING *`

const checkExistingBorrowingQuery = `SELECT * FROM borrowed_books WHERE book_id = $1 AND borrower_id = $2 AND returned_date IS NULL`

const getBookQuery = `SELECT available_quantity FROM books WHERE id = $1`

const getBorrowerQuery = `SELECT id FROM borrowers WHERE id = $1`

export { checkoutBookQuery, getBookQuery, getBorrowerQuery, checkExistingBorrowingQuery }