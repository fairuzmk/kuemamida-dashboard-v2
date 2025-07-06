import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../ui/table";
  
import Badge from "../ui/badge/Badge";
import type { BadgeColor } from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useUrl } from "../../context/UrlContext";





  
  export default function ListCustomComponent() {
    const navigate = useNavigate();
    const url = useUrl();
    const [list, setList] = useState<Array<{
        _id: string;
        customerName: string;
        additionalImages: string;
        phone: string;
        description: string;
        basePrice: number;
        totalPrice: number;
        cakeSize: string;
        cakeShape: string;
        cakeFlavor: string;
        krimFlavor: string;
        filling: string;
        themeColor: string;
        writingOnCake: string;
        topper: string;
        topperPrice: number;
        addOn: string;
        addOnPrice: string;
        pickupDate: Date;
        status: string;
        createdAt: Date;
    }>>([]);
  
    const fetchList = async () => {
      const response = await axios.get(`${url}/api/custom-order/list`);
      console.log(response.data)
      if (response.data.success){
        const parsedData = response.data.data.map((item: any) => ({
            ...item,
            pickupDate: new Date(item.pickupDate),
            createdAt: new Date(item.createdAt),
          }));
        setList(parsedData)
      }
      else{
        toast.error("Error")
      }
    }

    const editFood = async(foodId:string) => {
   
      navigate(`/edit-custom-product/${foodId}`);
    }

    const viewInvoice = async(foodId:string) => {
   
        navigate(`/invoice-custom/${foodId}`);
      }

    const removeFood = async(foodId: string) => {
      const result = await Swal.fire({
        title: "Yakin ingin menghapus produk ini?",
        text: "Aksi ini tidak dapat dibatalkan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${url}/api/custom-order/remove`, { id: foodId });
    
          if (response.data.success) {
            toast.success("Produk berhasil dihapus.");
            await fetchList();
          } else {
            toast.error(response.data.message || "Gagal menghapus produk.");
          }
        } catch (error) {
          toast.error("Terjadi kesalahan saat menghapus.");
          console.error(error);
        }
      }
    };
  
    useEffect(()=>{
      fetchList();
    },[]) 

    const formatDate = (date: Date) => {
        const dd = String(date.getDate()).padStart(2, '0');
        const months = [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const mm = months[date.getMonth()];
        const yyyy = date.getFullYear();
      
        return `${dd} ${mm} ${yyyy}`;
      };

      const statusList = [
        { value: "pending", label: "Pending" },
        { value: "confirmed", label: "Dikonfirmasi" },
        { value: "in-progress", label: "Dalam Progress" },
        { value: "completed", label: "Selesai" },
        { value: "cancelled", label: "Dibatalkan" },
    
      ];
      
      // Mapping status ke warna yang sesuai
      const statusColorMap: Record<string, BadgeColor> = {
        pending: "warning",
        confirmed: "primary",
        "in-progress": "info",
        completed: "success",
        cancelled: "error", // ganti dari destructive ke error sesuai BadgeColor
      };

    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Pemesan
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Deskripsi Singkat
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tanggal Diambil
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tanggal Dibuat
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Total Harga
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
                
              </TableRow>
            </TableHeader>
  
            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {list.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img
                          width={40}
                          height={40}
                          src={`${url}/images/custom/`+item.additionalImages}
                          
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {item.customerName}
                        </span>
                        <span className="block font-small text-gray-400 text-theme-sm dark:text-white/90">
                          {item.phone}
                        </span>
                        
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <span className="block font-small text-gray-700 text-theme-sm dark:text-white/90">
                          Tema: {item.description}
                        </span>
                        <span className="block font-small text-gray-700 text-theme-sm dark:text-white/90">
                          Uk : {item.cakeSize} cm
                        </span>
                        <span className="block font-small text-gray-700 text-theme-sm dark:text-white/90">
                          Rasa Kue : {item.cakeFlavor}, Selai {item.krimFlavor}, Krim {item.krimFlavor}
                        </span>
                        <span className="block font-small text-gray-700 text-theme-sm dark:text-white/90">
                          Topper : {item.topper}
                        </span>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex -space-x-2">
                      {formatDate(item.pickupDate)}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {formatDate(item.createdAt)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={statusColorMap[item.status] ?? "default"}
                  >
                    {statusList.find((s) => s.value === item.status)?.label ?? item.status}
                  </Badge>
                   
                  </TableCell>
                  <TableCell className=" py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <span className="block font-small text-gray-700 text-theme-sm dark:text-white/90">
                         Rp. {item.totalPrice}
                        </span>
                  </TableCell>
                  <TableCell className=" py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <p className="inline text-blue-500 cursor-pointer" onClick={()=>viewInvoice(item._id)}>View</p>  | <p className="inline text-green-500 cursor-pointer" onClick={()=>editFood(item._id)}>Edit</p>  | <p className="cursor-pointer inline text-red-700" onClick={()=>removeFood(item._id)}>Delete</p> 
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
  