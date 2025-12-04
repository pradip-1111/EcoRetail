"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Download, Heart } from "lucide-react";
import { AddProductDialog } from "./add-product-dialog";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useProducts, type Product, type AddProductData } from "@/contexts/products-context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const getStatusVariant = (status: string) => {
  switch (status) {
    case "In Stock":
      return "default";
    case "Low Stock":
      return "secondary";
    case "Out of Stock":
      return "destructive";
    default:
      return "outline";
  }
};

export default function ProductsPage() {
  const { products, addProduct, deleteProduct } = useProducts();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddProduct = async (newProductData: AddProductData) => {
    await addProduct(newProductData);
    setIsAddDialogOpen(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
  };

  const groupedProducts = useMemo(() => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return products.reduce((acc, product) => {
      const month = monthNames[product.createdAt.getMonth()];
      const year = product.createdAt.getFullYear();
      const monthYear = `${month} ${year}`;
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [products]);

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.text("Eco-Product Catalog", 14, 16);
    let startY = 22;

    Object.entries(groupedProducts).forEach(([monthYear, monthProducts]) => {
      if (startY > 20) {
        startY += 10;
      }
      if (startY > 250) {
        doc.addPage();
        startY = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text(monthYear, 14, startY);
      doc.setFont("helvetica", "normal");
      startY += 8;

      const tableColumn = [
        "Product Name", "Score", "CO₂ (kg)",
        "Status", "Eco-Labels", "Societal Impact"
      ];

      const tableRows = monthProducts.map((product) => [
        product.name,
        product.score.toString(),
        product.co2Footprint.toFixed(2),
        product.status,
        product.labels.join(", "),
        product.societalImpact,
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: startY,
        theme: "striped",
        headStyles: { fillColor: [56, 102, 65] },
      });

      startY = (doc as any).lastAutoTable.finalY;
    });

    doc.save("eco-products.pdf");
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Green Product Catalog</h1>
            <p className="text-muted-foreground">Curated list of eco-rated products.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadPdf}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {Object.keys(groupedProducts).length > 0 ? (
            Object.entries(groupedProducts).map(([monthYear, monthProducts]) => (
              <Card key={monthYear}>
                <CardHeader>
                  <CardTitle>{monthYear}</CardTitle>
                  <CardDescription>Products added in {monthYear}.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead className="text-center">Score</TableHead>
                        <TableHead className="text-center">CO₂ (kg)</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead>Eco-Labels</TableHead>
                        <TableHead className="text-center">Impact</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="text-center">{product.score}</TableCell>
                          <TableCell className="text-center">{product.co2Footprint.toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={getStatusVariant(product.status) as any}>
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {product.labels.map((label) => (
                                <Badge key={label} variant="outline">{label}</Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {product.societalImpact === "Positive" && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="inline-flex">
                                    <Heart className="h-5 w-5 text-pink-500" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Positive Societal Impact</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No products found. Add a new product to get started.
              </CardContent>
            </Card>
          )}
        </div>

        <AddProductDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddProduct={handleAddProduct}
        />
      </div>
    </TooltipProvider>
  );
}
