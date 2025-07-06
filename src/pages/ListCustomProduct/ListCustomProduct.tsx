import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ListCustomComponent from "../../components/custom-product/ListCustomComponent";


export default function ListCustomProduct() {
  return (
    <>
      <PageMeta
        title="List Custom Product"
        description=""
      />
      <PageBreadcrumb pageTitle="List Custom Product" />
      <div className="space-y-6">
        <ComponentCard title="Daftar Produk">
          <ListCustomComponent/>  
        </ComponentCard>
      </div>
    </>
  );
}
