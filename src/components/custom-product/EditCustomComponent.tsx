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
    pickupDate: "",
    status: "",
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
    { value: "Custom", label: "Custom" },
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
    if (field === "cakeSize") {
      const selected = pilihanDiameter.find((item) => item.value === value);
      setData((prev) => ({
        ...prev,
        cakeSize: value,
        basePrice: selected?.price ?? 0,
      }));
    } else {
      setData((prev) => ({ ...prev, [field]: value }));
    }
  };


  useEffect(() => {
    const totalAddOnPrice = addOns.reduce((sum, item) => sum + item.addOnPrice, 0);
    setData((prev) => ({ ...prev, totalAddOn: totalAddOnPrice }));
    const total = data.basePrice + data.topperPrice + totalAddOnPrice;
    setData((prev) => ({ ...prev, totalPrice: total }));
  }, [data.basePrice, data.topperPrice, addOns]);


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

    formData.append("pickupDate", data.pickupDate)
    formData.append("status", data.status)
    formData.append("createdAt", data.createdAt)
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
            <Select options={pilihanDiameter} value={data.cakeSize} onChange={(v) => onSelectChange("cakeSize", v)} />
          </div>
          <div>
            <Label>Harga Base</Label>
            <Input type="number" name="basePrice" value={data.basePrice} onChange={onChangeHandler} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>Bentuk Kue</Label>
            <Select options={pilihanBentuk} value={data.cakeShape} onChange={(v) => onSelectChange("cakeShape", v)} />
          </div>
          <div>
            <Label>Rasa Kue</Label>
            <Input name="cakeFlavor" value={data.cakeFlavor} onChange={onChangeHandler} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>Filling</Label>
            <Input name="filling" value={data.filling} onChange={onChangeHandler} />
          </div>
          <div>
            <Label>Rasa Krim</Label>
            <Input name="krimFlavor" value={data.krimFlavor} onChange={onChangeHandler} />
          </div>
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

        <DatePicker
            id="pickupDate"
            label="Tanggal Penjemputan"
            placeholder="Pilih tanggal"
            value={data.pickupDate || undefined}
            onChange={(_, dateStr) => {
              setData((prev) => ({ ...prev, pickupDate: dateStr })); // langsung simpan string dari flatpickr
            }}
            
          />

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
