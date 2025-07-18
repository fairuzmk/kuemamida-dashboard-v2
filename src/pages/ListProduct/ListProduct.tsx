import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ListProductsComponent from "../../components/product/ListProductsComponent";


export default function ListProduct() {
  return (
    <>
      <PageMeta
        title="List Product"
        description=""
      />
      <PageBreadcrumb pageTitle="List Product" />
      <div className="space-y-6">
        <ComponentCard title="Daftar Produk">
          <ListProductsComponent/>  
        </ComponentCard>
      </div>
    </>
  );
}
