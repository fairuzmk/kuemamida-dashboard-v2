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

  type Product = {
    _id: string;
    name: string;
    category: string;
    price: string;
    stock: string;
    description: string;
    inStock: boolean;
    image: string;
  };

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
        setPreviewImage(`${url}/images/${product.image}`);
      }
    } catch (err) {
      toast.error("Gagal mengambil data produk");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSelectChange = (value: string) => {
    setData((prev) => ({ ...prev, category: value }));
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", id!); // <-- kirim ID produk
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("description", data.description);
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

          <Button size="md" variant="primary">
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
