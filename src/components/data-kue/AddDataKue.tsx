import React, { useState } from 'react';
import axios from 'axios';
import { useUrl } from '../../context/UrlContext';





type OptionItem = {
  value: string;
  label: string;
  price: number;
};

type OptionsType = {
  [key: string]: OptionItem[];
};

const AddDataKue: React.FC = () => {
  const [options, setOptions] = useState<OptionsType>({});
  const [newOptionType, setNewOptionType] = useState<string>('');

  const handleAddOptionType = () => {
    const trimmed = newOptionType.trim();
    if (!trimmed || options[trimmed]) return;
    setOptions((prev) => ({ ...prev, [trimmed]: [] }));
    setNewOptionType('');
  };

  const handleAddItem = (type: string) => {
    const newItem: OptionItem = { value: '', label: '', price: 0 };
    setOptions((prev) => ({
      ...prev,
      [type]: [...prev[type], newItem],
    }));
  };

  const handleItemChange = (
    type: string,
    index: number,
    field: keyof OptionItem,
    value: string | number
  ) => {
    const updated = [...options[type]];
    const item = { ...updated[index] };

    if (field === 'price') {
      item[field] = Number(value);
    } else {
      item[field] = value as string;
    }

    updated[index] = item;
    setOptions((prev) => ({ ...prev, [type]: updated }));
  };

  const url = useUrl();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('options', JSON.stringify(options));
    try {
      const res = await axios.post(`${url}/api/options/`, formData);
      if (res.data.success) {
        alert('Berhasil disimpan');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan');
    }
  };


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Form Data Kue</h2>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Nama Opsi (contoh: Diameter)"
          value={newOptionType}
          onChange={(e) => setNewOptionType(e.target.value)}
          className="border p-2 rounded-l w-full"
        />
        <button
          type="button"
          onClick={handleAddOptionType}
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Tambah Jenis
        </button>
      </div>

      {Object.keys(options).map((type) => (
        <div key={type} className="mb-6 border-t pt-4">
          <h3 className="font-bold mb-2">{type}</h3>
          {options[type].map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                placeholder="Value"
                value={item.value}
                onChange={(e) =>
                  handleItemChange(type, index, 'value', e.target.value)
                }
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Label"
                value={item.label}
                onChange={(e) =>
                  handleItemChange(type, index, 'label', e.target.value)
                }
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Harga"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(type, index, 'price', Number(e.target.value))
                }
                className="border p-2 rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddItem(type)}
            className="text-sm text-blue-500 hover:underline"
          >
            + Tambah item ke {type}
          </button>
        </div>
      ))}

      <button
        type="submit"
        onClick={handleSubmit}
        className="mt-4 bg-green-500 text-white px-6 py-2 rounded"
      >
        Simpan Semua
      </button>
    </div>
  );
};

export default AddDataKue;
