import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import CreateProduct from "../../components/product/CreateProduct";

export default function AddProduct() {
  return (
    <div>
      <PageMeta
        title="Add Your Product"
        description=""
      />
      <PageBreadcrumb pageTitle="Add Products" />
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <CreateProduct/>

        </div>
        
      </div>
    </div>
  );
}
