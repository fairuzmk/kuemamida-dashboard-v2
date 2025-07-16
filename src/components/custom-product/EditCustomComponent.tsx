import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import Radio from "../form/input/Radio";
import DatePicker from "../form/date-picker";
import Button from "../ui/button/Button";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-toastify";
import { useUrl } from "../../context/UrlContext";
import { FaTrash } from "react-icons/fa";
import { MdOutlinePlaylistAdd } from "react-icons/md";


export default function EditCustomComponent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const url = useUrl();
  const [files, setFiles] = useState<File[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("pending");

  const [pilihanDiameter, setPilihanDiameter] = useState<{ value: string; label: string; price?: number }[]>([]);
  const [pilihanBentuk, setPilihanBentuk] = useState<{ value: string; label: string; price?: number }[]>([]);
  const [pilihanRasa, setPilihanRasa] = useState<{ value: string; label: string; price?: number }[]>([]);
  const [pilihanFilling, setPilihanFilling] = useState<{ value: string; label: string; price?: number }[]>([]);
  const [pilihanKrim, setPilihanKrim] = useState<{ value: string; label: string; price?: number }[]>([]);
  const [pilihanShipping, setPilihanShipping] = useState<{ value: string; label: string; price?: number }[]>([]);

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
          const shippingList = mergedOptions["Shipping Fee"] || [];
  
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

          const formattedShipping = shippingList.map((item: any) => ({
            value: item.value,
            label: item.label, 
            price: item.price,
          }));
          

          setPilihanDiameter(formattedDiameter);
          setPilihanBentuk(formattedBentuk);
          setPilihanRasa(formattedRasa);
          setPilihanFilling(formattedFilling);
          setPilihanKrim(formattedKrim);
          setPilihanShipping(formattedShipping);

        }
      } catch (err) {
        console.error("Gagal mengambil data opsi:", err);
      }
    };


    fetchOptions();
  }, []);

  const [data, setData] = useState({
    customerName: "",
    phone: "",
    description: "",
    basePrice: 0,
    totalPrice: 0,
    cakeSize: "",
    cakeShape: "",
    cakeFlavor: "",
    krimFlavor: "",
    filling: "",
    themeColor: "",
    writingOnCake: "",
    topper: "",
    topperPrice: 0,
    totalAddOn: 0,
    pickupTime: "",
    pickupDate: "",
    status: "",
    shipping_method:"",
    shipping_fee:0,
    createdAt: new Date().toISOString(),
  });
  type AddOnType = {
    addOn: string;
    addOnPrice: number;
  };

  const [addOns, setAddOns] = useState<AddOnType[]>([{ addOn: "", addOnPrice: 0 }]);

  const statusList = [
    { value: "Pending", label: "Pending" },
    { value: "Confirmed", label: "Dikonfirmasi" },
    { value: "In-progress", label: "Dalam Progress" },
    { value: "Completed", label: "Selesai" },
    { value: "Cancelled", label: "Dibatalkan" },
  ];



  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
    },
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/api/custom-order/list`);
      if (response.data.success) {

        const fetched = response.data.data.find((d: any) => d._id === id);
        setData({
          ...fetched,
          createdAt: new Date(fetched.createdAt).toISOString(),
        });

        setSelectedStatus(fetched.status || "Pending");

        setAddOns(
          Array.isArray(fetched.addOns) && fetched.addOns.length > 0
            ? fetched.addOns
            : [{ addOn: "", addOnPrice: 0 }]
        );
        console.log(fetched);
      } else {
        toast.error("Gagal mengambil data");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    }
  };



  useEffect(() => {
    if (id) fetchData();
  }, [id]);


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

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const onSelectChange = (field: string, value: string) => {
    let extra = {};

    if (field === "shipping_method") {
      const selected = pilihanShipping.find((item) => item.value === value);
      extra = {
        shipping_fee: selected?.price || 0,
      };
    }
    setData((prev) => ({
      ...prev,
      [field]: value,
      ...extra,
    }));


  };


  useEffect(() => {
    // Ambil item yang dipilih user dari daftar opsi
    const selectedDiameter = pilihanDiameter.find(item => item.value === data.cakeSize);
    const selectedBentuk = pilihanBentuk.find(item => item.value === data.cakeShape);
    const selectedRasa = pilihanRasa.find(item => item.value === data.cakeFlavor);
    const selectedFilling = pilihanFilling.find(item => item.value === data.filling);
    const selectedKrim = pilihanKrim.find(item => item.value === data.krimFlavor);
    const selectedShipping = pilihanShipping.find(item => item.value === data.shipping_method);
  
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
    
    //Hitung Shipping
    const shippingFee = selectedShipping?.price || 0;

    setData(prev => ({ ...prev, shipping_fee: shippingFee }));
    // Hitung total harga keseluruhan
    const total = totalOptPrice + data.topperPrice + totalAddOnPrice + shippingFee;
    setData(prev => ({ ...prev, totalPrice: total }));
  }, [
    data.cakeSize,
    data.cakeShape,
    data.cakeFlavor,
    data.filling,
    data.krimFlavor,
    data.topperPrice,
    data.shipping_method,
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
 

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setData((prev) => ({ ...prev, status: value }));
  };
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData();
    formData.append("id", id!); // <-- kirim ID produk
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
    formData.append("totalAddOn", data.totalAddOn.toString())
    formData.append("themeColor", data.themeColor)
    formData.append("writingOnCake", data.writingOnCake)
    formData.append("topper", data.topper)
    formData.append("topperPrice", data.topperPrice.toString())
    formData.append("pickupTime", data.pickupTime)
    formData.append("pickupDate", data.pickupDate)
    formData.append("status", data.status)
    formData.append("createdAt", data.createdAt)
    formData.append("shipping_method", data.shipping_method)
    formData.append("shipping_fee", data.shipping_fee.toString())
    if (files.length > 0) {
        formData.append("additionalImages", files[0]);
      }
    formData.append("addOns", JSON.stringify(addOns));

    try {
      const res = await axios.post(`${url}/api/custom-order/edit`, formData);
      if (res.data.success) {
        toast.success("Custom order berhasil diperbarui");
        setTimeout(() => navigate("/list-custom-product"), 1500);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan");
    } finally {
      setLoading(false); // selesai loading
    }
  };



  return (
    <ComponentCard title="Edit Custom Order">
      <form onSubmit={onSubmitHandler} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>Nama Pemesan</Label>
            <Input name="customerName" value={data.customerName} onChange={onChangeHandler} />
          </div>
          <div>
            <Label>No. HP</Label>
            <Input name="phone" value={data.phone} onChange={onChangeHandler} />
          </div>
        </div>
        <div>
          <Label>Deskripsi</Label>
          <Input name="description" value={data.description} onChange={onChangeHandler} />
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
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>Warna Krim</Label>
            <Input name="themeColor" value={data.themeColor} onChange={onChangeHandler} />
          </div>
          <div>
            <Label>Tulisan di Kue</Label>
            <Input name="writingOnCake" value={data.writingOnCake} onChange={onChangeHandler} />
          </div>
        </div>

        {/* <div className="grid grid-cols-2 gap-6">
          
          <div>
            <Label>Topper</Label>
            <Input name="topper" value={data.topper} onChange={onChangeHandler} />
          </div>
          <div>
            <Label>Harga Topper</Label>
            <Input type="number" name="topperPrice" value={data.topperPrice} onChange={onChangeHandler} />
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
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-3 mb-3">
          <div>
          <DatePicker
            id="pickupDate"
            label="Tanggal Penjemputan"
            placeholder="Pilih tanggal"
            value={data.pickupDate || undefined}
            onChange={(_, dateStr) => {
              setData((prev) => ({ ...prev, pickupDate: dateStr })); // langsung simpan string dari flatpickr
            }}
            
          />
          </div>

          <div>
          <Label>Jam Penjemputan</Label>
          <Input 
              type="text"  
              id="pickupTime"
              name="pickupTime"
              placeholder="Masukkan Jam (Jam 16.00 / Sore)"
              onChange={onChangeHandler} value={data.pickupTime}/>
          </div>
          </div>
        
          <div className="grid grid-cols-2 gap-6">
            <div>
            <Label>Shipping Method</Label>
            <Select
                options={pilihanShipping}
                placeholder="Select an option"
                onChange={(value) => onSelectChange("shipping_method", value)}
                className="dark:bg-dark-900"
                name="shipping_method"
                value={data.shipping_method}
            />
            </div>


            <div>
            
                       
            <Label htmlFor="tm">Shipping Fee</Label>
            <div className="relative">
                <Input
                type="number"
                placeholder="Shipping Fee"
                className="pl-[62px]"
                name="shipping_fee"
                onChange={onChangeHandler}
                value={data.shipping_fee}
                disabled
                />
                <span className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
                Rp
                </span>
               
            </div>
            
            </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {statusList.map((item) => (
            <Radio
                id={`status-${item.value}`}
              key={item.value}
              name="status"
              value={item.value}
              checked={selectedStatus === item.value}
              onChange={() => handleStatusChange(item.value)}
              label={item.label}
            />
          ))}
        </div>
        <div>
          <Label>Total Harga</Label>
          <Input type="number" value={data.totalPrice} disabled />
        </div>
        <p className="text-blue-500 text-sm mt-1 mb-3 space-y-1">
              {(data.basePrice) > 0 && (
                <span className="block">
                  Base Price: Rp {data.basePrice.toLocaleString()}
                </span>
              )}
              {(data.totalAddOn) > 0 && (
                <span className="block">
                  Add On: Rp {data.totalAddOn.toLocaleString()}
                </span>
              )}
              {(data.shipping_fee) > 0 && (
                <span className="block">
                  Ongkir: {data.shipping_fee.toLocaleString()}
                </span>
              )}
              
            </p>
        <div>
          <Label>Upload Gambar</Label>
          <div
            {...getRootProps()}
            className="p-4 border-2 border-dashed rounded-lg text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            <p>{isDragActive ? "Drop file di sini..." : "Drag & drop atau klik untuk pilih gambar"}</p>
          </div>
          {files.length > 0 && (
            <div className="mt-4 flex gap-2">
              {files.map((file, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>
        <Button variant="primary" size="md" disabled={loading}
        >{loading?"Updating..":"Update Product"}</Button>
      </form>
    </ComponentCard>
  );
}
