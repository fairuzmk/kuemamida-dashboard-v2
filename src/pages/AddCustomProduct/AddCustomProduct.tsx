import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AddCustomComponent from "../../components/custom-product/AddCustomComponent";


export default function AddCustomProduct() {
  
  return (
    <div>
      <PageMeta
        title="Add Custom Product"
        description=""
      />
      <PageBreadcrumb pageTitle="Add Custom Products" />
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <AddCustomComponent />

        </div>
        
      </div>
    </div>
  );
}
