const searchBooksQuery = `SELECT * FROM books
WHERE ($1::varchar IS NULL OR title ILIKE '%' || $1 || '%')
AND ($2::varchar IS NULL OR author ILIKE '%' || $2 || '%')
AND ($3::varchar IS NULL OR isbn = $3)`

export default searchBooksQuery