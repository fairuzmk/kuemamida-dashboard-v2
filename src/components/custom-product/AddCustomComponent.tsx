
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";

import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import Button from "../../components/ui/button/Button";
// import {  } from "../../icons";
// import Dropzone from "react-dropzone";
import axios from "axios"
import { toast } from "react-toastify";

import { useUrl } from "../../context/UrlContext";
import Radio from "../form/input/Radio";
import DatePicker from "../form/date-picker";



export default function AddCustomComponent() {


const url = useUrl();
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
  
  const pilihanDiameter = [
    { value: "16", label: "16 cm", price: 100000 },
    { value: "18", label: "18 cm", price: 120000 },
    { value: "20", label: "20 cm", price: 140000 },
    { value: "22", label: "22 cm", price: 150000 },
    { value: "custom", label: "Custom Size" },

  ];

  const pilihanBentuk = [
    { value: "Round", label: "Bulat" },
    { value: "Square", label: "Kotak" },
    { value: "Custom", label: "custom" },

  ];


  const statusList = [
    { value: "Pending", label: "Pending" },
    { value: "Confirmed", label: "Dikonfirmasi" },
    { value: "In-progress", label: "Dalam Progress" },
    { value: "Completed", label: "Selesai" },
    { value: "Cancelled", label: "Dibatalkan" },

  ];



  const [selectedStatus, setSelectedStatus] = useState<string>("pending");

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setData((prev) => ({
      ...prev,
      status: value, // <- ini yang penting
    }));
  };


  const[data,setData] = useState({
    customerName: "",
    phone: "",
    description: "",
    basePrice: 0,
    totalPrice: 0,

    cakeSize: "", 
    cakeShape: "",

    cakeFlavor:"",
    krimFlavor:"",
    filling:"",
    themeColor:"",
    writingOnCake:"",
    topper: "",
    topperPrice: 0,
    addOn : "",
    addOnPrice:0,   
    pickupDate:"",
    status:"",
    createdAt:new Date().toISOString(),
  })

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data, [name]:value}))

    setData((prev) => ({
      ...prev,
      [name]: event.target.type === "number" ? Number(value) : value,
    }));
    
    // if (name === "price") {
    
    //   const cleaned = value.replace(/\D/g, "");
    //   setData((prev) => ({ ...prev, [name]: cleaned }));
    // } else {
    //   setData((prev) => ({ ...prev, [name]: value }));
    // }

  }
  
  const onSelectChange = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // LOGIKA cakeSize dan Price
    if (field === "cakeSize") {
      const selected = pilihanDiameter.find((item) => item.value === value);
      setData((prev) => ({
        ...prev,
        cakeSize: value,
        basePrice: selected?.price ?? 0, // ← fallback ke 0 jika tidak ketemu
      }));
    } else {
      // Untuk field lain seperti category
      setData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

  };



  const calculateTotalPrice = (base: number, addOn: number, topper: number) => {
    return base + addOn + topper;
  };

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      totalPrice: calculateTotalPrice(prev.basePrice, prev.addOnPrice, prev.topperPrice),
    }));
  }, [data.basePrice, data.addOnPrice, data.topperPrice]);

  // useEffect(()=>{
  //   console.log(data);
  // }, [data])

  const [loading, setLoading] = useState(false);
  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData();
    formData.append("customerName", data.customerName)
    formData.append("phone", data.phone)
    formData.append("description", data.description)
    formData.append("basePrice", data.basePrice.toString())
    formData.append("totalPrice", data.totalPrice.toString())
    formData.append("cakeSize", data.cakeSize)
    formData.append("cakeShape", data.cakeShape)
    formData.append("cakeFlavor", data.cakeFlavor)
    formData.append("krimFlavor", data.krimFlavor)
    formData.append("filling", data.filling)
    formData.append("themeColor", data.themeColor)
    formData.append("writingOnCake", data.writingOnCake)
    formData.append("topper", data.topper)
    formData.append("topperPrice", data.topperPrice.toString())
    formData.append("addOn", data.addOn)
    formData.append("addOnPrice", data.addOnPrice.toString())
    formData.append("pickupDate", data.pickupDate)
    formData.append("status", data.status)
    formData.append("createdAt", data.createdAt)
   
    formData.append("additionalImages", files[0]);

      // 🔍 Cetak ke console DEBUG
      // console.log("==== FormData Preview ====");
      // for (const [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }
    try {
      const response = await axios.post(`${url}/api/custom-order/add`, formData); //kirim data ke backend

    if (response.data.success){
      setData({
      customerName: "",
      phone: "",
      description: "",
      basePrice: 0,
      totalPrice: 0,
  
      cakeSize: "", 
      cakeShape: "",

      cakeFlavor:"",
      krimFlavor:"",
      filling:"",
      themeColor:"",
      writingOnCake:"",
      topper: "",
      topperPrice: 0,
      addOn : "",
      addOnPrice:0,   
      pickupDate:"",
      status:"",
      createdAt:"",
      })
      setFiles([])
      toast.success(response.data.message)
    }
    else{
      toast.error(response.data.message)
    }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan");
    } finally {
      setLoading(false); // selesai loading
    }
    
  }

  return (
    <>
    <ComponentCard title="Tambahkan Produk">
      <form onSubmit={onSubmitHandler}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
            <div>
            <Label htmlFor="input">Nama Pemesan</Label>
            <Input 
            type="text"  
            id="customerName"
            name="customerName"
            onChange={onChangeHandler} value={data.customerName}/>
            </div>
            <div>
            <Label htmlFor="input">Nomor HP/WA</Label>
            <Input 
            type="text"  
            id="phone"
            name="phone"
            onChange={onChangeHandler} value={data.phone}/>
            </div>
        </div>
        <div>
          <Label>Description</Label>
          <Input 
            type="text"  
            id="description"
            name="description"
            placeholder="Pesan dari pembeli / Tema Kue Ultah"
            onChange={onChangeHandler} value={data.description}/>
        </div>

        <div className="grid grid-cols-2 gap-6">
            <div>
            <Label>Diameter Kue</Label>
            <Select
                options={pilihanDiameter}
                placeholder="Select an option"
                onChange={(value) => onSelectChange("cakeSize", value)}
                className="dark:bg-dark-900"
                name="cakeSize"
                value={data.cakeSize}
            />
            </div>
            <div>
            <Label htmlFor="tm">Harga Base</Label>
            <div className="relative">
                <Input
                type="number"
                placeholder="Harga Base"
                className="pl-[62px]"
                name="basePrice"
                onChange={onChangeHandler}
                value={data.basePrice}
                />
                <span className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
                Rp
                </span>
                
            </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
            <div>
            <Label>Bentuk Kue</Label>
            <Select
                options={pilihanBentuk}
                placeholder="Select an option"
                onChange={(value) => onSelectChange("cakeShape", value)}
                className="dark:bg-dark-900"
                name="cakeShape"
                value={data.cakeShape}
            />
            </div>
            

            <div>
            <Label>Rasa Kue</Label>
            <Input 
            type="text"  
            id="cakeFlavor"
            name="cakeFlavor"
            placeholder="Cokelat / Oreo / Vanilla"
            onChange={onChangeHandler} value={data.cakeFlavor}/>
            </div>


        </div>
        <div className="grid grid-cols-2 gap-6">
        <div>
            <Label>Filling Kue</Label>
            <Input 
            type="text"  
            id="filling"
            name="filling"
            placeholder="Strawberry / Vanilla / etc"
            onChange={onChangeHandler} value={data.filling}/>
            </div>

            <div>
            <Label>Rasa Krim</Label>
            <Input 
            type="text"  
            id="krimFlavor"
            name="krimFlavor"
            placeholder="Cokelat / Vanilla / Strawberry"
            onChange={onChangeHandler} value={data.krimFlavor}/>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
            <div>
            <Label>Warna Krim</Label>
            <Input 
            type="text"  
            id="themeColor"
            name="themeColor"
            placeholder=""
            onChange={onChangeHandler} value={data.themeColor}/>
            </div>
            

            <div className="col-span-2">
            <Label>Tulisan di Kue</Label>
            <Input 
            type="text"  
            id="writingOnCake"
            name="writingOnCake"
            placeholder="Tulisan di Kue"
            onChange={onChangeHandler} value={data.writingOnCake}/>
            </div>

        </div>

        <div className="grid grid-cols-2 gap-6">
            <div>
            <Label>Topper</Label>
            <Input 
            type="text"  
            id="topper"
            name="topper"
            placeholder="Topper"
            onChange={onChangeHandler} value={data.topper}/>

            </div>
            <div>
            <Label htmlFor="tm">Harga Topper</Label>
            <div className="relative">
                <Input
                type="number"
                placeholder="Harga Topper"
                className="pl-[62px]"
                name="topperPrice"
                onChange={onChangeHandler}
                value={data.topperPrice}
                />
                <span className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
                Rp
                </span>
            </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
            <div>
            <Label>Add On</Label>
            <Input 
            type="text"  
            id="addOn"
            name="addOn"
            placeholder="Add On"
            onChange={onChangeHandler} value={data.addOn}/>

            </div>
            <div>
            <Label htmlFor="tm">Harga Add On</Label>
            <div className="relative">
                <Input
                type="number"
                placeholder="Harga Topper"
                className="pl-[62px]"
                name="addOnPrice"
                onChange={onChangeHandler}
                value={data.addOnPrice}
                />
                <span className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
                Rp
                </span>
            </div>
            </div>
        </div>

        <DatePicker
            id="date-picker"
            label="Tanggal Penjemputan"
            placeholder="Select a date"
            onChange={(dates: Date[]) => {
              const date = dates?.[0];
              if (!date) return;
            
              const formatted = date.toISOString().split("T")[0]; // "2025-07-05"
            
              setData((prev) => ({
                ...prev,
                pickupDate: formatted,
              }));
            }}
            
          />
          

        <div className="flex flex-wrap items-center gap-8">
        {statusList.map((item) => (
        <Radio
          id={`status-${item.value}`}
          key={item.value}
          name="status"
          value={item.value}
          checked={selectedStatus === item.value}
          onChange={handleStatusChange}
          label={item.label}
        />
        ))}
        </div>
        

        
            <div>
            <Label htmlFor="tm">Total Harga Produk</Label>
            <div className="relative">
                <Input
                type="number"
                placeholder="Harga Produk"
                className="pl-[62px]"
                name="totalPrice"
                onChange={onChangeHandler}
                value={data.totalPrice  }
                disabled
                />
                <span className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
                Rp
                </span>
            </div>
            </div>

         
       
    <div>
        <Label htmlFor="stock">Gambar Contoh</Label>
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
              disabled={loading}
              
            >
              {loading?"Uploading..":"Tambah Produk"}
            </Button>
       
      </div>
    </form>
    </ComponentCard>
    
    
    </>
    
    
  );
}
