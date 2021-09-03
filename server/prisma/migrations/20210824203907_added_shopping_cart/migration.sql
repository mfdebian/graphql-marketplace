-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShoppingCart" (
    "id" SERIAL NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToShoppingCart" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToShoppingCart_AB_unique" ON "_ProductToShoppingCart"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToShoppingCart_B_index" ON "_ProductToShoppingCart"("B");

-- AddForeignKey
ALTER TABLE "_ProductToShoppingCart" ADD FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToShoppingCart" ADD FOREIGN KEY ("B") REFERENCES "ShoppingCart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
