import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUrl } from '../../context/UrlContext';
import ComponentCard from '../common/ComponentCard';
import { useNavigate } from 'react-router';
import Swal from "sweetalert2";
import {toast} from "react-toastify";

type OptionItem = {
  value: string;
  label: string;
  price: number;
};

type OptionsType = {
  [key: string]: OptionItem[];
};

type OptionDocument = {
  _id: string;
  options: OptionsType;
};

const ListDataKue: React.FC = () => {
    const url = useUrl();
  const [data, setData] = useState<OptionDocument[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editOptions, setEditOptions] = useState<OptionsType>({});

  const fetchOptions = async () => {
    const res = await axios.get(`${url}/api/options/`);
    setData(res.data.data);
  };

  
  useEffect(() => {
    fetchOptions();
  }, []);

  const handleEdit = (item: OptionDocument) => {
    setEditingId(item._id);
    setEditOptions({ ...item.options }); // clone editable
  };

  const handleItemChange = (
    type: string,
    index: number,
    field: keyof OptionItem,
    value: string | number
  ) => {
    const updated = [...editOptions[type]];
    const item = { ...updated[index] };

    if (field === 'price') {
        item[field] = Number(value);
    } else {
        item[field] = value as string;
    }

    updated[index] = item;
    setEditOptions((prev) => ({ ...prev, [type]: updated }));
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('options', JSON.stringify(editOptions));
    await axios.put(`${url}/api/options/${editingId}`, formData);
    setEditingId(null);
    fetchOptions();
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
        title: "Yakin ingin menghapus data ini?",
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
            const response = await axios.delete(`${url}/api/options/${id}`);
            
    
          if (response.data.success) {
            toast.success("Produk berhasil dihapus.");
            await fetchOptions();
          } else {
            toast.error(response.data.message || "Gagal menghapus produk.");
          }
        } catch (error) {
          toast.error("Terjadi kesalahan saat menghapus.");
          console.error(error);
        }
      }
    
  };

  const navigate = useNavigate();

  return (
  <ComponentCard title="Daftar Data Kue">
  <div className="p-3 md:p-6">
  <div className="text-start mb-5">
    <button
      onClick={() => navigate('/add-data-kue')}
      className="px-3 py-2 bg-green-600 text-white rounded"
    >
      Tambah Data
    </button>
  </div>

  {data.map((item) => (
    <div key={item._id} className="border rounded p-4 mb-4 bg-white shadow">
      {(editingId === item._id ? Object.keys(editOptions) : Object.keys(item.options)).map((type) => {
        const currentOptions = editingId === item._id ? editOptions[type] : item.options[type];

        return (
          <div key={type} className="mb-8">
            <h4 className="font-semibold text-xl md:text-2xl mb-3">Data {type}</h4>

            <div className="overflow-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100 text-gray-700 md:text-xl">
                  <tr>
                    <th className="border p-2">Value</th>
                    <th className="border p-2">Label</th>
                    <th className="border p-2">Harga</th>
                  </tr>
                </thead>
                <tbody className='md:text-lg text-center'>
                  {currentOptions.map((opt, idx) => (
                    <tr key={idx} className="border-t">
                      {editingId === item._id ? (
                        <>
                          <td className="border p-2">
                            <input
                              className="w-full border p-1"
                              value={opt.value}
                              onChange={(e) => handleItemChange(type, idx, 'value', e.target.value)}
                            />
                          </td>
                          <td className="border p-2">
                            <input
                              className="w-full border p-1"
                              value={opt.label}
                              onChange={(e) => handleItemChange(type, idx, 'label', e.target.value)}
                            />
                          </td>
                          <td className="border p-2">
                            <input
                              className="w-full border p-1"
                              type="number"
                              value={opt.price}
                              onChange={(e) => handleItemChange(type, idx, 'price', Number(e.target.value))}
                            />
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border p-2">{opt.value}</td>
                          <td className="border p-2">{opt.label}</td>
                          <td className="border p-2">Rp {opt.price?.toLocaleString() ?? '-'}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <div className="flex flex-col items-center md:justify-between mb-2">
        <strong className="hidden md:block">ID: {item._id}</strong>
        {editingId === item._id ? (
          <div className="space-x-2 my-5">
            <button onClick={handleSave} className="px-3 py-1 bg-green-600 text-white rounded">
              Simpan
            </button>
            <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-400 text-white rounded">
              Batal
            </button>
          </div>
        ) : (
          <div className="space-x-2 my-5">
            <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-blue-600 text-white rounded">
              Edit
            </button>
            <button onClick={() => handleDelete(item._id)} className="px-3 py-1 bg-red-600 text-white rounded">
              Hapus
            </button>
          </div>
        )}
      </div>
    </div>
  ))}
</div>

    </ComponentCard>
  );
};

export default ListDataKue;
