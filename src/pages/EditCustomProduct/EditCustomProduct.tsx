import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import EditCustomComponent from "../../components/custom-product/EditCustomComponent";


export default function EditCustomProduct() {
  
  return (
    <div>
      <PageMeta
        title="Edit Custom Product"
        description=""
      />
      <PageBreadcrumb pageTitle="Edit Custom Products" />
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <EditCustomComponent />

        </div>
        
      </div>
    </div>
  );
}
