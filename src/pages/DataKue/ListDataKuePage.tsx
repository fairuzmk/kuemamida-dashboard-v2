import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ListDataKue from "../../components/data-kue/ListDataKue";


export default function ListDataKuePage() {
  
  return (
    <div>
      <PageMeta
        title="Database Harga Custom Cake"
        description=""
      />
      <PageBreadcrumb pageTitle="Database Harga Custom Cake" />
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <ListDataKue />

        </div>
        
      </div>
    </div>
  );
}
