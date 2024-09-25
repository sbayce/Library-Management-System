const updateBookQuery = `UPDATE books SET
title = COALESCE($1, title),
author = COALESCE($2, author),
isbn = COALESCE($3, isbn),
available_quantity = COALESCE($4, available_quantity),
shelf_location = COALESCE($5, shelf_location)
WHERE id = $6 RETURNING *`

export default updateBookQuery