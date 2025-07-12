import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AddDataKue from "../../components/data-kue/AddDataKue";


export default function AddDataKuePage() {
  
  return (
    <div>
      <PageMeta
        title="Add Data Harga Kue"
        description=""
      />
      <PageBreadcrumb pageTitle="Add Data Harga Kue" />
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <AddDataKue />

        </div>
        
      </div>
    </div>
  );
}
