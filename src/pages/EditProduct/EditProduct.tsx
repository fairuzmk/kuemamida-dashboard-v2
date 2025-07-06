import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import EditProductComponent from "../../components/product/EditProductComponent";

export default function EditProduct() {
  return (
    <div>
      <PageMeta
        title="Edit Your Product"
        description=""
      />
      <PageBreadcrumb pageTitle="Edit Products" />
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <EditProductComponent/>

        </div>
        
      </div>
    </div>
  );
}
