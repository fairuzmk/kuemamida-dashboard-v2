
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
import { FaTrash } from "react-icons/fa";
import { MdOutlinePlaylistAdd } from "react-icons/md";


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
  
  const [pilihanDiameter, setPilihanDiameter] = useState<{ value: string; label: string; price?: number }[]>([]);
  const [pilihanBentuk, setPilihanBentuk] = useState<{ value: string; label: string; price?: number }[]>([]);
  const [pilihanRasa, setPilihanRasa] = useState<{ value: string; label: string; price?: number }[]>([]);
  const [pilihanFilling, setPilihanFilling] = useState<{ value: string; label: string; price?: number }[]>([]);
  const [pilihanKrim, setPilihanKrim] = useState<{ value: string; label: string; price?: number }[]>([]);


  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get(`${url}/api/options`);
        const allOptions = res.data.data.map((doc: any) => doc.options || {});
        const mergedOptions = Object.assign({}, ...allOptions);

        if (mergedOptions) {
          const diameterList = mergedOptions["Diameter"] || [];
          const bentukList = mergedOptions["Bentuk"] || [];
          const rasaList = mergedOptions["Rasa"] || [];
          const fillingList = mergedOptions["Filling"] || [];
          const krimList = mergedOptions["Krim"] || [];
  
          const formattedDiameter = diameterList.map((item: any) => ({
            value: item.value,
            label: item.label,
            price: item.price,
          }));
  
          const formattedBentuk = bentukList.map((item: any) => ({
            value: item.value,
            label: item.label, 
            price: item.price,
          }));

          const formattedRasa = rasaList.map((item: any) => ({
            value: item.value,
            label: item.label, 
            price: item.price,
          }));

          const formattedFilling = fillingList.map((item: any) => ({
            value: item.value,
            label: item.label, 
            price: item.price,
          }));

          const formattedKrim = krimList.map((item: any) => ({
            value: item.value,
            label: item.label, 
            price: item.price,
          }));

          

          setPilihanDiameter(formattedDiameter);
          setPilihanBentuk(formattedBentuk);
          setPilihanRasa(formattedRasa);
          setPilihanFilling(formattedFilling);
          setPilihanKrim(formattedKrim);

        }
      } catch (err) {
        console.error("Gagal mengambil data opsi:", err);
      }
    };


    fetchOptions();
  }, []);

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
      status: value, 
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
    totalAddOn: 0,
    pickupDate:"",
    status:"",
    createdAt:new Date().toISOString(),
  })

  type AddOnType = {
    addOn: string;
    addOnPrice: number;
  };

  const [addOns, setAddOns] = useState<AddOnType[]>([{ addOn: "", addOnPrice: 0 }]);


  const handleAddOnChange = (
    index: number,
    field: keyof AddOnType,
    value: string | number
  ) => {
    const newAddOns = [...addOns];
    newAddOns[index] = {
      ...newAddOns[index],
      [field]: field === "addOnPrice" ? Number(value) : value as string,
    };
    setAddOns(newAddOns);
  };

  const handleAddAddOn = () => {
    setAddOns([...addOns, { addOn: "", addOnPrice: 0 }]);
  };

  const handleRemoveAddOn = (index: number) => {
    setAddOns((prev) => prev.filter((_, i) => i !== index));
  };

  
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


  };


  


  useEffect(() => {
    // Ambil item yang dipilih user dari daftar opsi
    const selectedDiameter = pilihanDiameter.find(item => item.value === data.cakeSize);
    const selectedBentuk = pilihanBentuk.find(item => item.value === data.cakeShape);
    const selectedRasa = pilihanRasa.find(item => item.value === data.cakeFlavor);
    const selectedFilling = pilihanFilling.find(item => item.value === data.filling);
    const selectedKrim = pilihanKrim.find(item => item.value === data.krimFlavor);
  
    const totalOptPrice = [
      selectedDiameter?.price || 0,
      selectedBentuk?.price || 0,
      selectedRasa?.price || 0,
      selectedFilling?.price || 0,
      selectedKrim?.price || 0,
    ].reduce((acc, val) => acc + val, 0);
  
    
    setData(prev => ({ ...prev, basePrice: totalOptPrice }));
  
    // Hitung total Add On
    const totalAddOnPrice = addOns.reduce((sum, item) => sum + item.addOnPrice, 0);
    setData(prev => ({ ...prev, totalAddOn: totalAddOnPrice }));
  
    // Hitung total harga keseluruhan
    const total = totalOptPrice + data.topperPrice + totalAddOnPrice;
    setData(prev => ({ ...prev, totalPrice: total }));
  }, [
    data.cakeSize,
    data.cakeShape,
    data.cakeFlavor,
    data.filling,
    data.krimFlavor,
    data.topperPrice,
    addOns,
    pilihanDiameter,
    pilihanBentuk,
    pilihanRasa,
    pilihanFilling,
    pilihanKrim
  ]);
  

  // Ambil item yang dipilih user dari daftar opsi
  const selectedDiameter = pilihanDiameter.find(item => item.value === data.cakeSize);
  const selectedBentuk = pilihanBentuk.find(item => item.value === data.cakeShape);
  const selectedRasa = pilihanRasa.find(item => item.value === data.cakeFlavor);
  const selectedFilling = pilihanFilling.find(item => item.value === data.filling);
  const selectedKrim = pilihanKrim.find(item => item.value === data.krimFlavor);
  

  
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
    formData.append("totalAddOn", data.totalAddOn.toString())
    formData.append("pickupDate", data.pickupDate)
    formData.append("status", data.status)
    formData.append("createdAt", data.createdAt)
    
    formData.append("additionalImages", files[0]);
    

    formData.append("addOns", JSON.stringify(addOns));
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
      totalAddOn: 0,
      pickupDate:"",
      status:"",
      createdAt:"",
      })

      setAddOns([{ addOn: "", addOnPrice: 0 }]);
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
            
            <div>
            <Label>Bentuk Kue</Label>
            <Select
                options={pilihanBentuk}
                placeholder="Pilih Bentuk Kue"
                onChange={(value) => onSelectChange("cakeShape", value)}
                className="dark:bg-dark-900"
                name="cakeShape"
                value={data.cakeShape}
            />
            </div>    
            
            </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
           
            <div>
            <Label>Rasa Kue</Label>
            <Select
              options={pilihanRasa}
              placeholder="Pilih Rasa Kue" 
              onChange={(value) => onSelectChange("cakeFlavor", value)} 
              name="cakeFlavor"
              value={data.cakeFlavor}/>
            </div>

            <div>
            <Label>Rasa Krim</Label>
            <Select 
            options= {pilihanKrim}
            name="krimFlavor"
            placeholder="Pilih Krim Kue"
            onChange={(value) => onSelectChange("krimFlavor", value)} 
            value={data.krimFlavor}/>
            </div>

        </div>
        <div className="grid grid-cols-2 gap-6">
        <div>
            <Label>Filling Kue</Label>
            <Select 
              options ={pilihanFilling}
              placeholder = "Pilih Filling Kue"
              name="filling"
              onChange={(value) => onSelectChange("filling", value)} 
              value={data.filling}/>
            </div>

           
        </div> 

          <div>
            <Label htmlFor="tm">Sub Total Base</Label>
            <div className="relative">
                <Input
                type="number"
                placeholder="Total Add On Produk"
                className="pl-[62px]"
                name="basePrice"
                onChange={onChangeHandler}
                value={data.basePrice}
                disabled
                />
                <span className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
                Rp
                </span>
               
            </div>
            
            <p className="text-red-500 text-sm mt-3 space-y-1">
              {(selectedDiameter?.price ?? 0) > 0 && (
                <span className="block">
                  Base Diameter: Rp {selectedDiameter?.price?.toLocaleString()}
                </span>
              )}
              {(selectedBentuk?.price ?? 0) > 0 && (
                <span className="block">
                  Bentuk Kue: Rp {selectedBentuk?.price?.toLocaleString()}
                </span>
              )}
              {(selectedRasa?.price ?? 0) > 0 && (
                <span className="block">
                  Rasa Kue: Rp {selectedRasa?.price?.toLocaleString()}
                </span>
              )}
              {(selectedFilling?.price ?? 0) > 0 && (
                <span className="block">
                  Filling Kue: Rp {selectedFilling?.price?.toLocaleString()}
                </span>
              )}
              {(selectedKrim?.price ?? 0) > 0 && (
                <span className="block">
                  Krim Kue: Rp {selectedKrim?.price?.toLocaleString()}
                </span>
              )}
            </p>
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

        {/* <div className="grid grid-cols-2 gap-6">
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
        </div> */}

        
        <div className="space-y-4">
            <Label>Topper dan Lainnya (Add On)</Label>
            {addOns.map((item, index) => (
              <>

            <div key={index} className="grid gridcols-1 md:grid-cols-2 gap-4 items-start">
                <div>
                  <Input
                    type="text"
                    placeholder="Nama Add On"
                    value={item.addOn}
                    onChange={(e) => handleAddOnChange(index, "addOn", e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative w-full">
                    <Input
                      type="number"
                      placeholder="Harga Add On"
                      className="pl-[62px]"
                      value={item.addOnPrice}
                      onChange={(e) => handleAddOnChange(index, "addOnPrice", e.target.value)}
                    />
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 px-3 py-2 border-r">
                      Rp
                    </span>
                  </div>
                    {addOns.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAddOn(index)}
                        className="text-white text-sm bg-red-400 px-3 py-3 rounded-md"
                      >
                        <FaTrash/>
                      </button>
                      
                    )}
                    <button
                      type="button"
                      onClick={handleAddAddOn}
                      className="my-2 px-2.5 py-2.5 bg-blue-500 text-lg text-white rounded-md hover:bg-blue-600"
                    >
                      <MdOutlinePlaylistAdd />
                    </button>
                    
                </div>
                
              </div>
              <div className="border-t-1 border-dashed border-gray-400 my-3"/>
              
              </>
            ))}

            
            </div>
          </div>

          <div>
            <Label htmlFor="tm">Total Harga AddOn</Label>
            <div className="relative">
                <Input
                type="number"
                placeholder="Total Add On Produk"
                className="pl-[62px]"
                name="totalAddOn"
                onChange={onChangeHandler}
                value={data.totalAddOn}
                disabled
                />
                <span className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
                Rp
                </span>
            </div>


        <div className="mt-3 mb-3">
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
        </div>

        <div className="mt-5 mb-5 flex flex-col items-start md:flex-row md:items-start gap-8">
        <h2 className="text-md">Status Pesanan</h2>
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
        

        
            <div className="mb-5">
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

            <div className="mt-3"> 
            <Button
              size="md"
              variant="primary"
              disabled={loading}
              
            >
              {loading?"Uploading..":" + Tambah Produk"}
            </Button>
            </div>
       
      </div>
    </form>
    </ComponentCard>
    
    
    </>
    
    
  );
}
