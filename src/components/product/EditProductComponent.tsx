import { useEffect, useState } from "react";
import { useParams } from "react-router"; // <-- untuk ambil ID dari URL
import { useNavigate } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import Switch from "../form/switch/Switch";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { useUrl } from "../../context/UrlContext";
import { FaTrash } from "react-icons/fa";
import { MdOutlinePlaylistAdd } from "react-icons/md";



export default function EditProductComponent() {

  const navigate = useNavigate();
  const { id } = useParams(); // <-- ambil ID produk dari URL
  const url = useUrl();
  const [files, setFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // <-- untuk gambar lama

  const [data, setData] = useState<{
    name: string;
    category: string;
    price: string;
    stock: string;
    description: string;
    inStock: boolean;
  }>({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    inStock: true,
  });

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setPreviewImage(null); // <-- jika user upload baru, hilangkan preview lama
  };

  const { getRootProps, getInputProps } = useDropzone({
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

  type VariansType ={
    varianName: string;
    varianPrice: number;
    varianStock: number;

  };

  type Product = {
    _id: string;
    name: string;
    category: string;
    price: string;
    stock: string;
    description: string;
    inStock: boolean;
    image: string;
    varians: VariansType[];
  };
  

  const [varians, setVarians] = useState<VariansType[]>([{ varianName: "", varianPrice: 0, varianStock:0, }]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      const product = (response.data.data as Product[]).find((item: Product) => item._id === id);
      if (product) {
        setData({
          name: product.name,
          category: product.category,
          price: product.price,
          stock: product.stock,
          description: product.description,
          inStock: !!product.inStock,
        });

        setVarians(
          Array.isArray(product.varians) && product.varians.length > 0
            ? product.varians
            : [{ varianName: "", varianPrice: 0, varianStock: 0 }]
        )

        setPreviewImage(product.image);
      }
    } catch (err) {
      toast.error("Gagal mengambil data produk");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleVarianChange = (
    index: number,
    field: keyof VariansType,
    value: string | number | number
  ) => {
    const newVarians = [...varians];
    newVarians[index] = {
      ...newVarians[index],
      [field]: ["varianPrice", "varianStock"].includes(field) ? Number(value) : value as string,
    };
    setVarians(newVarians);
  };

  const handleAddVarian = () => {
    setVarians([...varians, { varianName: "", varianPrice: 0, varianStock: 0, }]);
  };

  const handleRemoveVarian = (index: number) => {
    setVarians((prev) => prev.filter((_, i) => i !== index));
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSelectChange = (value: string) => {
    setData((prev) => ({ ...prev, category: value }));
  };


  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("id", id!); // <-- kirim ID produk
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("description", data.description);
    formData.append("varians", JSON.stringify(varians));
    formData.append("inStock", (data.inStock ?? false).toString());
    if (files.length > 0) {
      formData.append("image", files[0]); // <-- jika ganti gambar
    }

    try {
      const response = await axios.post(`${url}/api/food/edit`, formData);
      if (response.data.success) {
        toast.success("Produk berhasil diperbarui");
        setTimeout(() => {
          navigate("/list-product"); // ganti ke path tujuanmu
        }, 1500); // biar toast sempat muncul
      } else {
        toast.error(response.data.message || "Gagal update produk");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menyimpan");
    } finally {
      setLoading(false); // selesai loading
    }
  };

  return (
    <ComponentCard title="Edit Produk">
      <form onSubmit={onSubmitHandler}>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Nama Produk</Label>
              <Input type="text" name="name" value={data.name} onChange={onChangeHandler} />
            </div>
            <div>
              <Label>Pilih Kategori</Label>
              <Select
                options={options}
                placeholder="Pilih kategori"
                onChange={onSelectChange}
                value={data.category}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label>Harga</Label>
              <div className="relative">
                <Input
                  type="number"
                  name="price"
                  value={data.price}
                  onChange={onChangeHandler}
                  className="pl-[62px]"
                />
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-11 w-[46px] flex items-center justify-center border-r border-gray-200 dark:border-gray-800">
                  Rp
                </span>
              </div>
            </div>
            <div>
              <Label>Stock</Label>
              <Input type="number" name="stock" value={data.stock} onChange={onChangeHandler} />
            </div>
            <div>
              <Label>Available</Label>
              <Switch
                label={data.inStock ? "Active" : "Not Active"}
                defaultChecked={data.inStock}
                onChange={(checked) => setData((prev) => ({ ...prev, inStock: checked }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Tambahkan Varian</Label>
            {varians.map((item, index) => (
              <>

              <div key={index} className="grid gridcols-1 md:grid-cols-2 gap-4 items-start">
                  <div>
                    <Input
                      type="text"
                      placeholder="Nama Add On"
                      value={item.varianName}
                      onChange={(e) => handleVarianChange(index, "varianName", e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative w-full">
                      <Input
                        type="number"
                        placeholder="Harga Add On"
                        className="pl-[62px]"
                        value={item.varianPrice}
                        onChange={(e) => handleVarianChange(index, "varianPrice", e.target.value)}
                      />
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 px-3 py-2 border-r">
                        Rp
                      </span>
                    </div>
                      {varians.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVarian(index)}
                          className="text-white text-sm bg-red-400 px-3 py-3 rounded-md"
                        >
                          <FaTrash/>
                        </button>
                        
                      )}
                      <button
                        type="button"
                        onClick={handleAddVarian}
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
            <Label>Deskripsi</Label>
            <Input type="text" name="description" value={data.description} onChange={onChangeHandler} />
          </div>

          <div>
            <Label>Gambar Produk</Label>
            {files.length > 0 ? (
              <img
                src={URL.createObjectURL(files[0])}
                alt="preview"
                className="w-[200px] h-auto my-2 rounded"
              />
            ) : previewImage ? (
              <img src={previewImage} alt="lama" className="w-[200px] h-auto my-2 rounded" />
            ) : null}
          </div>

          <div
            {...getRootProps()}
            className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500 p-6"
          >
            <input {...getInputProps()} />
            <p className="text-sm text-gray-600 text-center">Drag & drop atau klik untuk upload gambar baru</p>
          </div>

          <Button size="md" variant="primary" disabled={loading}>
            {loading?"Updating...":"Update Produk"}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
