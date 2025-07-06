import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import InvoiceComponent from "../../components/custom-product/InvoiceComponent";


export default function InvoiceCustom() {
  return (
    <>
      <PageMeta
        title="Invoice Custom Product"
        description=""
      />
      <PageBreadcrumb pageTitle="Invoice Custom Product" />
      <div className="space-y-6">
        <ComponentCard title="Invoice Pesanan">
          <InvoiceComponent/>  
        </ComponentCard>
      </div>
    </>
  );
}
