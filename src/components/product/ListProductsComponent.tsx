import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../ui/table";
  
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useUrl } from "../../context/UrlContext";





  
  export default function ListProductsComponent() {
    const navigate = useNavigate();
    const url = useUrl();
    const [list, setList] = useState<Array<{
      _id: string;
      image: string;
      name: string;
      category: string;
      stock: number;
      inStock: boolean;
      price: number;
    }>>([]);
    
    const [loading, setLoading] = useState(true);

    const fetchList = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/food/list`);
      
      if (response.data.success){
        setList(response.data.data)
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

    const editFood = async(foodId:string) => {
   
      navigate(`/edit-product/${foodId}`);
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
          const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    
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

    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        
        <div className="max-w-full overflow-x-auto">
          
        {loading ? (
            
            <div className="p-6 text-center text-gray-500 dark:text-gray-300">
              Fetch data from database...
            </div> )
 
            : ( 
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Product
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Kategori
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Stock
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
                  Harga
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {list.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img
                          width={40}
                          height={40}
                          src={item.image}
                          
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {item.name}
                        </span>
                        
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.category}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex -space-x-2">
                      {item.stock}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                         item.inStock ? "success" : "error"
                      }
                    >
                      {item.inStock?"Active":"Not Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                   Rp. {item.price}
                  </TableCell>
                  <TableCell className=" py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <p className="inline text-green-500 cursor-pointer" onClick={()=>editFood(item._id)}>Edit</p>  | <p className="cursor-pointer inline text-red-700" onClick={()=>removeFood(item._id)}>Delete</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            
          </Table>
          )}
        </div>
      </div>
    );
  }
  