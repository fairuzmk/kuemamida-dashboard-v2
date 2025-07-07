import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import axios from "axios";
import { useUrl } from "../../context/UrlContext";

const InvoiceComponent = () => {
  const { id } = useParams();
  const url = useUrl();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      const response = await axios.get(`${url}/api/custom-order/list`);
      if (response.data.success) {
        const item = response.data.data.find((d: any) => d._id === id);
        if (item) {
          setData({
            ...item,
            pickupDate: new Date(item.pickupDate),
            createdAt: new Date(item.createdAt),
          });
        } else {
          console.error("Data tidak ditemukan");
        }
      }
    };
    fetchInvoice();
  }, [id]);

  const formatDate = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const mm = months[date.getMonth()];
    const yyyy = date.getFullYear();
    return `${dd} ${mm} ${yyyy}`;
  };

  const formatRupiah = (value: number | string) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return num.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleDownload = async () => {
    if (!invoiceRef.current) return;

    const images = invoiceRef.current.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) => {
        if (!img.complete) {
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }
      })
    );

    const canvas = await html2canvas(invoiceRef.current, {
      useCORS: true,
      allowTaint: false,
      scale: 2,
    });

    const link = document.createElement("a");
    link.download = `invoice-${data.customerName}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const formatWA = (data: any) => {
    return `*Invoice Pemesanan Kue Mamida 🍰*\n
*Nama Pemesan:* ${data.customerName}
*No HP:* ${data.phone}
*Tanggal Order:* ${formatDate(data.createdAt)}
*Tanggal Diambil:* ${formatDate(data.pickupDate)}
-----------------------------
*Deskripsi:* ${data.description}
*Ukuran:* ${data.cakeShape} | ${data.cakeSize} cm
*Rasa:* ${data.cakeFlavor} | Krim: ${data.krimFlavor} | Selai: ${data.filling}
*Tulisan:* ${data.writingOnCake}
*Status:* ${data.status}
-----------------------------
*Topper:* ${data.topper} + ${formatRupiah(data.topperPrice)}
*Add-on:* ${data.addOn} + ${formatRupiah(data.addOnPrice)}

*Total Pesanan:* ${formatRupiah(data.totalPrice)}
------------------------------

*Pembayaran*
Transfer ke rekening :
BCA 8010763836 a.n. Dini Rizkita Sari

`;

  };

  if (!data) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-1 lg:p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Invoice Panel */}
        <div className="flex-1">
          <div
            ref={invoiceRef}
            className="bg-white shadow-md rounded-lg p-6 border overflow-visible"
            style={{ backgroundColor: "#fff", color: "#000" }}
          >
            <div className="flex flex-col-reverse md:flex-row md:items-start md:justify-between mb-6">
              <h2 className="text-2xl font-bold text-center lg:text-left md:text-4xl md:text-center mt-6">Rekap Pesanan</h2>
              <div className="w-40 h-auto flex-shrink-0 overflow-visible mx-auto md:mx-0">
                <img
                  src="/images/logo/mamidalogo.png"
                  alt="Logo Mamida"
                  className="w-full object-contain"
                  crossOrigin="anonymous"
                />
              </div>
            </div>

            <div className="mb-4 mt-10">
              <p><strong>Invoice #:</strong> {data._id}</p>
              <p><strong>Tanggal Order:</strong> {formatDate(data.createdAt)}</p>
              <p><strong>Tanggal Diambil:</strong> {formatDate(data.pickupDate)}</p>
              <p><strong>Pelanggan:</strong> {data.customerName}</p>
              <p><strong>No HP:</strong> {data.phone}</p>
            </div>

            <div className="border-t-2 border-dashed border-gray-400 my-4" />

            <div className="flex flex-col-reverse md:flex-row gap-6 mt-6">
              <div className="flex-1">
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="py-1 font-medium">Deskripsi</td>
                      <td className="py-1">{data.description}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Bentuk | Ukuran</td>
                      <td className="py-1">{data.cakeShape} | {data.cakeSize} cm</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Rasa</td>
                      <td className="py-1">{data.cakeFlavor} | Krim: {data.krimFlavor} | Selai: {data.filling}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Tulisan</td>
                      <td className="py-1">{data.writingOnCake}</td>
                    </tr>
                    
                    <tr>
                      <td className="py-1 font-medium">Topper</td>
                      <td className="py-1">{data.topper} <span className="font-bold" style={{ color: "#065f46" }}>+ {formatRupiah(data.topperPrice)}</span></td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Add-on</td>
                      <td className="py-1">{data.addOn} <span className="font-bold" style={{ color: "#065f46" }}>+ {formatRupiah(data.addOnPrice)}</span></td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Status</td>
                      <td className="py-1">{data.status}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="text-left mt-4">
                  <p className="text-lg md:text-2xl font-bold">Total Pesanan: {formatRupiah(data.totalPrice)}</p>
                </div>
              </div>

              {/* Gambar Kue */}
              <div className="w-48 flex-shrink-0 text-center mx-auto md:mx-0">
                <div className="w-full h-48 border rounded-md overflow-hidden ">
                  <img
                    src={`${url}/images/custom/${data.additionalImages}`}
                    alt="Gambar Kue"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2">Contoh Ilustrasi Kue</p>
              </div>
            </div>
            <div className="border-t-2 border-dashed border-gray-400 my-4" />

            <div>
            <h2 className="md:text-xl font-bold">Pembayaran</h2>
            <p className="md:text-lg">Transfer BCA</p>
            <p className="md:text-lg">Rek. 8010763836</p>
            <span className="md:text-lg">A.N Dini Rizkita Sari</span>
            </div>
            
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download Invoice
            </button>
          </div>
          
        </div>

        {/* Format WhatsApp */}
        <div className="w-full md:w-[400px]">
          <h2 className="text-2xl mb-5 font-bold">Format WA</h2>

          <textarea
            className="w-full border rounded p-4 text-sm font-mono bg-gray-50"
            rows={20}
            value={formatWA(data)}
            readOnly
          />

          <button
            onClick={() => {
              navigator.clipboard.writeText(formatWA(data));
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="mt-3 px-4 py-2 mr-5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            📋 Copy ke Clipboard
          </button>

          <a
            href={`https://web.whatsapp.com/send?phone=${data.phone.replace(/^0/, "62")}&text=${encodeURIComponent(formatWA(data))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
            >
            📤 Kirim via WhatsApp
            </a>
          


          {copied && <p className="text-green-600 text-sm mt-2">✅ Teks berhasil disalin!</p>}
        </div>
        
      </div>
    </div>
  );
};

export default InvoiceComponent;
