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
        const allOrders = response.data.data.sort(
          (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        const currentIndex = allOrders.findIndex((d: any) => d._id === id) + 1;

        const item = response.data.data.find((d: any) => d._id === id);
        if (item) {

          const pickupDate = new Date(item.pickupDate);
          const createdAt = new Date(item.createdAt);
  
          const invoiceNumber = String(currentIndex).padStart(4, '0');
          const invoiceMonth = String(createdAt.getMonth() + 1).padStart(2, '0');
          const invoiceYear = createdAt.getFullYear();
          const invoiceCode = `INV-${invoiceNumber}-${invoiceMonth}-${invoiceYear}`;
  
          setData({
            ...item,
            pickupDate: pickupDate,
            createdAt: new Date(item.createdAt),
            invoiceCode,
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
    const addOnList = data.addOns
    .map(
      (item: { addOn: string; addOnPrice: number }, index: number) =>
        `${index + 1}. ${item.addOn} + ${formatRupiah(item.addOnPrice)}`
    )
    .join('\n');
    return `*Invoice Pemesanan Kue Mamida 🍰*\n
*Nama Pemesan:* ${data.customerName}
*Tanggal Diambil:* ${formatDate(data.pickupDate)} ${data.pickupTime}

-----------------------------
*Deskripsi:* ${data.description}
*Ukuran:* ${data.cakeShape} | ${data.cakeSize} cm
*Rasa:* ${data.cakeFlavor} | Krim: ${data.krimFlavor} | Selai: ${data.filling}
*Warna:* ${data.themeColor}
*Tulisan:* ${data.writingOnCake}
*Topper: * 
${addOnList}
-----------------------------

Rincian Harga: 
Harga Kue : ${formatRupiah(data.basePrice)}
Topping : ${formatRupiah(data.totalAddOn)}

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
            style={{ backgroundColor: "#fdfff7", color: "#000" }}
          >
            <div className="flex flex-col-reverse mb-2 md:mb-6 md:flex-row md:items-start md:justify-between ">
              <h2 className="text-2xl font-bold text-center lg:text-left md:text-4xl md:text-center md:mt-6">Rekap Pesanan</h2>
              <div className="w-25 mb-5 md:w-40 md:h-auto flex-shrink-0 overflow-visible mx-auto md:mx-0">
                <img
                  src="/images/logo/mamidalogo.png"
                  alt="Logo Mamida"
                  className="w-full object-contain"
                  crossOrigin="anonymous"
                />
              </div>
            </div>

            <div className="mb-4 mt-5 md:mt-10">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td><p className="text-sm md:text-lg"><strong>Invoice ID :</strong>  </p> </td>
                  <td className="text-right"><p className="text-sm md:text-lg">{data.invoiceCode}</p></td>
                </tr>
                <tr>
                  <td><p className="text-sm md:text-lg"><strong>Pelanggan :</strong>  </p> </td>
                  <td className="text-right"><p className="text-sm md:text-lg">{data.customerName}</p></td>
                </tr>
                <tr>
                  <td><p className="text-sm md:text-lg"><strong>Tanggal Diambil : </strong>  </p> </td>
                  <td className="text-right"><p className="text-sm md:text-lg">{formatDate(data.pickupDate)} / {data.pickupTime}</p></td>
                </tr>
                <tr>
                  <td><p className="text-sm md:text-lg"><strong>Pengiriman: </strong>  </p> </td>
                  <td className="text-right"><p className="text-sm md:text-lg">{data.shipping_method}</p></td>
                </tr>
              </tbody>
            </table>
            </div>

            <div className="border-t-2 border-dashed border-gray-400 my-4" />

            <div className="flex flex-col-reverse md:flex-row gap-6 mt-6">
              <div className="flex-1">
                <table className="w-full text-sm">
                  <tbody className="text-sm md:text-lg">
                    <tr className="">
                      <td className="py-1 font-medium">Deskripsi</td>
                      <td className="py-1">{data.description}</td>
                    </tr>
                    <tr className="">
                      <td className="py-1 font-medium">Bentuk & Ukuran</td>
                      <td className="py-1">{data.cakeShape} | {data.cakeSize} cm</td>
                    </tr>
                    <tr className="">
                      <td className="py-1 font-medium">Rasa</td>
                      <td className="py-1">{data.cakeFlavor} | Krim: {data.krimFlavor} | Selai: {data.filling}</td>
                    </tr>
                    <tr className="">
                      <td className="py-1 font-medium">Warna</td>
                      <td className="py-1">{data.themeColor}</td>
                    </tr>
                    <tr className="">
                      <td className="py-1 font-medium">Tulisan</td>
                      <td className="py-1">{data.writingOnCake}</td>
                    </tr>
                    
                    <tr className="">
                      <td className="py-1 font-medium align-top">Add Ons</td>
                      <td className="py-1">
                        {data.addOns.map((item: { addOn: string; addOnPrice: number }, index: number) => (
                          <div key={index}>
                            {index + 1}. {item.addOn}{" "}
                            <span className="font-bold" style={{ color: "#065f46" }}>
                              + {formatRupiah(item.addOnPrice)}
                            </span>
                          </div>
                        ))}
                      </td>
                    </tr>
                    
                    
                  </tbody>
                </table>
                


                
              </div>

              {/* Gambar Kue */}
              <div className="w-48 flex-shrink-0 text-center mx-auto md:mx-0">
                <div className="w-full h-48 border rounded-md overflow-hidden ">
                  <img
                    src={typeof data.additionalImages === "string" 
                      ? data.additionalImages 
                      : data.additionalImages?.url}
                    alt="Gambar Kue"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2">Contoh Ilustrasi Kue</p>
              </div>
              
            </div>
            <div className="border-t-2 border-dashed border-gray-400 my-4" />
            <table className="w-full text-sm">
              
                  <tbody className="text-sm text-right md:text-lg">
                    <tr className="">
                      <td className="py-1 font-medium">Harga Kue</td>
                      <td className="py-1">{formatRupiah(data.basePrice)}</td>
                    </tr>
                    <tr className="">
                      <td className="py-1 font-medium">Topping dan Lainnya</td>
                      <td className="py-1">{formatRupiah(data.totalAddOn)}</td>
                    </tr>
                    {data.shipping_fee > 0 
                    ? (<tr className="">
                      <td className="py-1 font-medium">Ongkir</td>
                      <td className="py-1">{formatRupiah(data.shipping_fee)}</td>
                    </tr>) : (
                      <>
                      </>
                    )
                    }
                    <tr className="text-lg" style={{ color: "#800000" }}>
                      <td className="py-1 font-bold">Total Harga</td>
                      <td className="py-1 font-bold">{formatRupiah(data.totalPrice)}</td>
                    </tr>
                  
                  </tbody>
                </table>
            
            <div className="border-t-2 border-dashed border-gray-400 my-4" />
            <div className="mt-5">
            <h2 className="md:text-xl font-bold">Pembayaran</h2>
            <p className="md:text-lg">Transfer BCA</p>
            <p className="md:text-lg">8010763836</p>
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

        <div className="flex flex-col items-center gap-4 mt-4 lg:flex-row lg:justify-start">           
          <div className="mt-4 ">
          <button
            onClick={() => {
              navigator.clipboard.writeText(formatWA(data));
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-4 py-2 bg-blue-600 text-white text-md rounded hover:bg-blue-700"
          >
            Copy ke Clipboard
          </button>
          </div>
          <div className="mt-4">
          <a
            href={`https://wa.me/${data.phone.replace(/^0/, "62")}?text=${encodeURIComponent(formatWA(data))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 bg-green-500 text-white text-md rounded hover:bg-green-600"
            >
            Kirim via WhatsApp
          </a>
          </div>
          
        </div>
        {copied && <p className="text-green-600 text-sm mt-2">✅ Teks berhasil disalin!</p>}
        </div>   
      </div>
    </div>
  );
};

export default InvoiceComponent;
