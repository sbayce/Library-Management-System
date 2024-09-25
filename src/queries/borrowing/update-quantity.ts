const updateBookQuantityQuery = `UPDATE books SET
available_quantity = available_quantity + $1
WHERE id = $2 RETURNING available_quantity`

export default updateBookQuantityQuery