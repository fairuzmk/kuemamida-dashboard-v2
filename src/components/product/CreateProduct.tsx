
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";

import { useDropzone } from "react-dropzone";
import { useState } from "react";
import Button from "../../components/ui/button/Button";
// import {  } from "../../icons";
// import Dropzone from "react-dropzone";
import axios from "axios"
import { toast } from "react-toastify";
import Switch from "../form/switch/Switch";
import { useUrl } from "../../context/UrlContext";



export default function CreateProduct() {


const url = useUrl()
const [files, setFiles] = useState<File[]>([]);

const onDrop = (acceptedFiles: File[]) => {
  console.log("Files dropped:", acceptedFiles);
  setFiles(acceptedFiles);
};

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
  });
  
  const options = [
    { value: "Kue Ultah", label: "Kue Ultah" },
    { value: "Cake Potong", label: "Cake Potong" },
    { value: "Kue Brownies", label: "Kue Brownies" },
    { value: "Kue Bolen", label: "Bolen Pisang" },
    { value: "Kue Risol", label: "Risol" },
    { value: "Snack Box", label: "Snack Box" },
    { value: "Kue Kering", label: "Kue Kering" },
  

  ];


  const[data,setData] = useState({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      inStock: true,
  })

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data, [name]:value}))


    if (name === "price") {
    
      const cleaned = value.replace(/\D/g, "");
      setData((prev) => ({ ...prev, [name]: cleaned }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }

  }
  
  const onSelectChange = (value: string) => {
    setData((prev) => ({ ...prev, category: value }));
  };

  const formatRupiah = (value: string) => {
    const cleaned = value.replace(/\D/g, ""); // hanya angka
    if (!cleaned) return "";
    return new Intl.NumberFormat("id-ID").format(parseInt(cleaned));
  };

  // useEffect(()=>{
  //   console.log(data);
  // }, [data])

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("category", data.category)
    formData.append("price", data.price)
    formData.append("stock", data.stock)
    formData.append("description", data.description)
    formData.append("inStock", data.inStock.toString())
    files.forEach((file) => {
      formData.append("image", file);
    })
    const response = await axios.post(`${url}/api/food/add`, formData);
    if (response.data.success){
      setData({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        inStock: true,
      })
      setFiles([])
      toast.success(response.data.message)
    }
    else{
      toast.error(response.data.message)
    }
  }

  return (
    <>
    <ComponentCard title="Tambahkan Produk">
      <form onSubmit={onSubmitHandler}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
            <div>
            <Label htmlFor="input">Nama Produk</Label>
            <Input 
            type="text"  
            id="name"
            name="name"
            onChange={onChangeHandler} value={data.name}/>
            </div>
            <div>
            <Label>Pilih Kategori</Label>
            <Select
                options={options}
                placeholder="Select an option"
                onChange={onSelectChange}
                className="dark:bg-dark-900"
                name="category"
                value={data.category}
            />
            </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
            <div>
            <Label htmlFor="tm">Harga Produk</Label>
            <div className="relative">
                <Input
                type="number"
                placeholder="Harga Produk"
                className="pl-[62px]"
                name="price"
                onChange={onChangeHandler}
                value={formatRupiah(data.price)}
                />
                <span className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
                Rp
                </span>
            </div>
            </div>
            <div>
            <Label htmlFor="stock">Stock</Label>
            <Input 
            type="number" 
            id="stock" 
            name="stock"
            onChange={onChangeHandler}
            value={data.stock}
            
            />
            </div>
            <div>
            <Label htmlFor="stock">Available</Label>
            <Switch
              label={data.inStock ? "Active" : "Not Active"}
              defaultChecked={true}
              name="inStock"

              onChange={(checked, name) => {
                if (name) {
                  setData((prev) => ({ ...prev, [name]: checked }));
                }
              }}
            />
            
            </div>
            
        </div>
         
        <div>
          <Label>Description</Label>
          <Input 
            type="text"  
            id="description"
            name="description"
            onChange={onChangeHandler} value={data.description}/>
        </div>
    <div>
        <Label htmlFor="stock">Gambar Produk</Label>
    </div>
    <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
    {files.length === 0 ? (
        <div
          {...getRootProps()}
          className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10 ${
            isDragActive
              ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
              : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
          }`}
          id="demo-upload"
        >
          <input {...getInputProps()} />
          <div className="dz-message flex flex-col items-center m-0!">
            {/* Icon + Text area */}
          <div className="dz-message flex flex-col items-center m-0!">
            {/* Icon Container */}
            <div className="mb-[22px] flex justify-center">
              <div className="flex h-[68px] w-[68px]  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <svg
                  className="fill-current"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                  />
                </svg>
              </div>
            </div>

            {/* Text Content */}
            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
            </h4>

            <span className=" text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
              Drag and drop your PNG, JPG, WebP, SVG images here or browse
            </span>

            <span className="font-medium underline text-theme-sm text-brand-500">
              Browse File
            </span>
          </div>
          </div>
          </div>
          ) : (

            <div className="mt-4 flex gap-4 items-center justify-center">
              {files.map((file, index) => (
                <div key={index} className="w-50 h-50 overflow-hidden rounded border flex flex-col items-center ">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-contain items-center"
                  />
                </div>
              ))}
            </div>
          )}
          {files.length > 0 && (
              <div className="mt-4 mb-4 flex justify-center ">             
              <button
                type="button"
                className="text-md text-red-500 underline"
                onClick={() => setFiles([])}
              >
                Ganti Gambar
              </button>
              </div>
            )}

      </div>

         
       <Button
              size="md"
              variant="primary"
              
              
            >
              Tambah Produk
            </Button>
       
      </div>
    </form>
    </ComponentCard>
    
    
    </>
    
    
  );
}
