import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../ui/table";
  // import Badge from "../ui/badge/Badge";
  import { useEffect, useState } from "react";
  // import { useNavigate } from "react-router";
  import { useUrl } from "../../context/UrlContext";
  import axios from "axios";
  import Swal from "sweetalert2";
  import { toast } from "react-toastify";
  
  // function statusPesananBadge(status: string) {
  //   switch (status) {
  //     case "Diantar": return "success";
  //     case "Diproses": return "warning";
  //     case "Pesanan Baru": return "error";
  //     default: return "error";
  //   }
  // }
  
  // function statusPaymentBadge(status: string) {
  //   switch (status) {
  //     case "Paid": return "success";
  //     case "COD": return "warning";
  //     case "Belum dibayar": return "error";
  //     default: return "error";
  //   }
  // }



  export default function OrderComponent() {

        // const navigate = useNavigate();
    const url = useUrl();
    const [list, setList] = useState<Array<any>>([]);
    
    const [loading, setLoading] = useState(true);

    const fetchList = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/order/allorder`);
        console.log(response);
      
      if (response.data.success){
        setList(response.data.orders)
      }
      else{
        toast.error("Database Error")
      } 
      } catch (error) {
        toast.error("Database Error")
      } finally {
        setLoading(false);
      }
      
    }



    const handleDeleteOrder = async (orderId: string) => {
      const confirm = await Swal.fire({
        title: "Yakin ingin menghapus pesanan ini?",
        text: "Aksi ini tidak dapat dibatalkan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });
    
      if (confirm.isConfirmed) {
        try {
          const response = await axios.post(`${url}/api/order/delete`, {
            id: orderId,
          });
    
          if (response.data.success) {
            toast.success("Pesanan berhasil dihapus");
            fetchList(); // Refresh list
          } else {
            toast.error("Gagal menghapus pesanan");
          }
        } catch (err) {
          toast.error("Terjadi kesalahan saat menghapus");
        }
      }
    };
    
  
    useEffect(()=>{
      fetchList();
    },[]) 
  
    
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
  
    const sortedData = [...list].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (sortBy === "user.name") {
        aVal = a.address?.name || "";
        bVal = b.address?.name || "";
      } else if (sortBy === "totalOrder") {
        aVal = a.amount + a.shipping_fee;
        bVal = b.amount + b.shipping_fee;
      } else if (sortBy === "statusOrder") {
        aVal = a.status || "Pesanan Baru";
        bVal = b.status || "Pesanan Baru";
      }

      return sortDirection === "asc"
        ? aVal.localeCompare?.(bVal) ?? aVal - bVal
        : bVal.localeCompare?.(aVal) ?? bVal - aVal;
    });
  
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    const handleUpdateStatus = async (
      orderId: string,
      newStatus: string,

    ) => {
      try {
        console.log("Update order ID:", orderId);
        const response = await axios.post(`${url}/api/order/update-order`, {
          id: orderId,
          status: newStatus,
 
        });
        
        if (response.data.success) {
          toast.success("Status pesanan berhasil diupdate");
          fetchList();
        } else {
          toast.error("Gagal mengupdate status pesanan");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat update status pesanan");
      }
    };

    const handleUpdatePayment = async (
      orderId: string,
      newPayment: string
    ) => {
      try {
        console.log("Update order ID:", orderId);
        const response = await axios.post(`${url}/api/order/update-order`, {
          id: orderId,
          payment: newPayment,
        });
        
        if (response.data.success) {
          toast.success("Status Pembayaran berhasil diupdate");
          fetchList();
        } else {
          toast.error("Gagal mengupdate status pembayaran");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat update status pembayaran");
      }
    };
  
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          {loading? (<div className="p-6 text-center text-gray-500 dark:text-gray-300">
              Fetch data from database...
            </div>) 
            : (
              <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  onClick={() => handleSort("user.name")}
                  className="px-5 py-3 font-medium  text-start text-theme-xs dark:text-gray-400 cursor-pointer"
                >
                  Pemesan
                </TableCell>
                <TableCell isHeader className="px-1 py-3 text-theme-xs text-start hidden md:table-cell"
                >Pesanan

                </TableCell>
                
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
                <TableCell isHeader className="px-5 py-3 text-theme-xs">
                  Status Pembayaran</TableCell>
                  <TableCell isHeader className="px-5 py-3 text-theme-xs">
                  Action</TableCell>
              </TableRow>
            </TableHeader>
  
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
             {list?.map((order, index) => (
                <TableRow key={order._id || index}   className={
                  order.status === "Pesanan Baru"
                  ? "bg-blue-50"
                  : order.status === "Diproses" && order.payment === false
                  ? "bg-orange-50"
                  : order.status === "Diproses" && order.payment === true
                  ? "bg-green-50"
                  : order.status === "Dibatalkan"
                  ? "bg-red-50"
                  : ""
                }>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-3">
                      
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.address?.name || 'Tanpa Nama'}
                        </span>
                        <span className="block font-medium text-gray-400 text-theme-sm dark:text-white/90">
                          Shipping : {order.shipping_method || ''}
                        </span>
                        <span className="block font-medium text-gray-400 text-theme-sm dark:text-white/90">
                          {order.address?.detail || ''}
                        </span>

                        <span className="block font-medium text-gray-400 text-theme-sm dark:text-white/90">
                          Pembayaran : {order.payment_method || ''}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm hidden md:table-cell">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i}>
                        {item.name} x {item.quantity}
                        {item.variant && ` (${item.variant})`}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm">
                    Rp. {new Intl.NumberFormat("id-ID").format(order.amount + order.shipping_fee)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                    >
                      <option value="Pesanan Baru">Pesanan Baru</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm">
                  <select
                      className="border rounded px-2 py-1 text-sm"
                      value={order.payment}
                      onChange={(e) =>
                        handleUpdatePayment(order._id, e.target.value)
                      }
                    >
                      <option value="true">Sudah Bayar</option>
                      <option value="false">Belum Bayar</option>
                    </select>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm">
                  <p className="inline text-blue-500 cursor-pointer">View</p>  | <p className="cursor-pointer inline text-red-700" onClick={()=>handleDeleteOrder(order._id)}>Delete</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            )}
          
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
  