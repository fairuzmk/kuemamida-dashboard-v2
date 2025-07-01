import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../ui/table";
  import Badge from "../ui/badge/Badge";
  import { useState } from "react";
  
  function statusPesananBadge(status: string) {
    switch (status) {
      case "Diantar": return "success";
      case "Diproses": return "warning";
      case "Pesanan Baru": return "error";
      default: return "error";
    }
  }
  
  function statusPaymentBadge(status: string) {
    switch (status) {
      case "Paid": return "success";
      case "COD": return "warning";
      case "Belum dibayar": return "error";
      default: return "error";
    }
  }
  
  interface Order {
    id: number;
    user: {
      image: string;
      name: string;
    };
    pesanan: {
      product: string;
      qty: number;
    }[];
    totalOrder: number;
    statusOrder: string;
    statusPayment: string;
  }
  
  const tableData: Order[] = [
    {
      id: 1,
      user: {
        image: "/images/user/user-17.jpg",
        name: "Dafi Arkatama",
      },
      pesanan: [
        { product: "Kue Ultah", qty: 1 },
        { product: "Brownies", qty: 2 },
        { product: "Donat", qty: 6 },
      ],
      totalOrder: 500000,
      statusOrder: "Pesanan Baru",
      statusPayment: "Paid",
    },
    {
      id: 2,
      user: {
        image: "/images/user/user-17.jpg",
        name: "Fairuz Kuswa",
      },
      pesanan: [
        { product: "Kue Ultah", qty: 1 },
        { product: "Brownies", qty: 2 },
        { product: "Donat", qty: 6 },
        { product: "Kue Ultah", qty: 1 },
        { product: "Brownies", qty: 2 },
        { product: "Donat", qty: 6 },
      ],
      totalOrder: 800000,
      statusOrder: "Diproses",
      statusPayment: "COD",
    },
    {
        id: 3,
        user: {
          image: "/images/user/user-17.jpg",
          name: "Fairuz Kuswa",
        },
        pesanan: [
          { product: "Kue Ultah", qty: 1 },
          { product: "Brownies", qty: 2 },
          { product: "Donat", qty: 6 },
          { product: "Kue Ultah", qty: 1 },
          { product: "Brownies", qty: 2 },
          { product: "Donat", qty: 6 },
        ],
        totalOrder: 800000,
        statusOrder: "Diproses",
        statusPayment: "COD",
      },
      {
        id: 4,
        user: {
          image: "/images/user/user-17.jpg",
          name: "Fairuz Kuswa",
        },
        pesanan: [
          { product: "Kue Ultah", qty: 1 },
          { product: "Brownies", qty: 2 },
          { product: "Donat", qty: 6 },
          { product: "Kue Ultah", qty: 1 },
          { product: "Brownies", qty: 2 },
          { product: "Donat", qty: 6 },
        ],
        totalOrder: 800000,
        statusOrder: "Diproses",
        statusPayment: "COD",
      },
      {
        id: 5,
        user: {
          image: "/images/user/user-17.jpg",
          name: "Fairuz Kuswa",
        },
        pesanan: [
          { product: "Kue Ultah", qty: 1 },
          { product: "Brownies", qty: 2 },
          { product: "Donat", qty: 6 },
          { product: "Kue Ultah", qty: 1 },
          { product: "Brownies", qty: 2 },
          { product: "Donat", qty: 6 },
        ],
        totalOrder: 800000,
        statusOrder: "Diproses",
        statusPayment: "COD",
      },
      {
        id: 6,
        user: {
          image: "/images/user/user-17.jpg",
          name: "Fairuz Kuswa",
        },
        pesanan: [
          { product: "Kue Ultah", qty: 1 },
          { product: "Brownies", qty: 2 },
          { product: "Donat", qty: 6 },
          { product: "Kue Ultah", qty: 1 },
          { product: "Brownies", qty: 2 },
          { product: "Donat", qty: 6 },
        ],
        totalOrder: 800000,
        statusOrder: "Diproses",
        statusPayment: "COD",
      },
  ];
  
  export default function OrderComponent() {
    const [sortBy, setSortBy] = useState<"user.name" | "totalOrder" | "statusOrder">("user.name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
  
    const handleSort = (field: typeof sortBy) => {
      if (sortBy === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortBy(field);
        setSortDirection("asc");
      }
    };
  
    const sortedData = [...tableData].sort((a, b) => {
      let aVal: any = sortBy === "user.name" ? a.user.name : a[sortBy];
      let bVal: any = sortBy === "user.name" ? b.user.name : b[sortBy];
      return sortDirection === "asc"
        ? aVal.localeCompare?.(bVal) ?? aVal - bVal
        : bVal.localeCompare?.(aVal) ?? bVal - aVal;
    });
  
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  onClick={() => handleSort("user.name")}
                  className="px-5 py-3 font-medium  text-start text-theme-xs dark:text-gray-400 cursor-pointer"
                >
                  User
                </TableCell>
                <TableCell isHeader className="px-1 py-3 text-theme-xs text-start">Pesanan</TableCell>
                <TableCell
                  isHeader
                  onClick={() => handleSort("totalOrder")}
                  className="px-5 py-3 font-medium  text-start text-theme-xs dark:text-gray-400 cursor-pointer"
                >
                  Total Pesanan
                </TableCell>
                <TableCell
                  isHeader
                  onClick={() => handleSort("statusOrder")}
                  className="px-5 py-3 font-medium  text-start text-theme-xs dark:text-gray-400 cursor-pointer"
                >
                  Status Pesanan
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-theme-xs">Status Pembayaran</TableCell>
              </TableRow>
            </TableHeader>
  
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedData.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img
                          width={40}
                          height={40}
                          src={order.user.image}
                          alt={order.user.name}
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.user.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-start">
                    {order.pesanan.map((item, i) => (
                      <div key={i} className="text-theme-sm text-start">
                        {item.product} x {item.qty}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm">
                    Rp. {new Intl.NumberFormat("id-ID").format(order.totalOrder)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm">
                    <Badge size="sm" color={statusPesananBadge(order.statusOrder)}>
                      {order.statusOrder}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm">
                    <Badge size="sm" color={statusPaymentBadge(order.statusPayment)}>
                      {order.statusPayment}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
  
        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3 text-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    );
  }
  