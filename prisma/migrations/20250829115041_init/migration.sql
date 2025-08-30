-- CreateTable
CREATE TABLE "public"."Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "availableQuantity" INTEGER NOT NULL,
    "shelfLocation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Borrower" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Borrower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Borrowing" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "borrowerId" INTEGER NOT NULL,
    "checkoutDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "returnedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Borrowing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "public"."Book"("isbn");

-- CreateIndex
CREATE INDEX "Book_title_idx" ON "public"."Book"("title");

-- CreateIndex
CREATE INDEX "Book_author_idx" ON "public"."Book"("author");

-- CreateIndex
CREATE INDEX "Book_isbn_idx" ON "public"."Book"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "Borrower_email_key" ON "public"."Borrower"("email");

-- CreateIndex
CREATE INDEX "Borrower_email_idx" ON "public"."Borrower"("email");

-- CreateIndex
CREATE INDEX "Borrowing_bookId_borrowerId_idx" ON "public"."Borrowing"("bookId", "borrowerId");

-- CreateIndex
CREATE INDEX "Borrowing_dueDate_idx" ON "public"."Borrowing"("dueDate");

-- CreateIndex
CREATE INDEX "Borrowing_returnedDate_idx" ON "public"."Borrowing"("returnedDate");

-- AddForeignKey
ALTER TABLE "public"."Borrowing" ADD CONSTRAINT "Borrowing_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "public"."Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Borrowing" ADD CONSTRAINT "Borrowing_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "public"."Borrower"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
