import AddPropertyForm from "@/components/AddPropertyForm";

export default function AddPropertyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
        <p className="text-gray-500 mt-1">Fill in the details to list a new property on Mahabaleshwar Stay.</p>
      </div>

      <AddPropertyForm />
    </div>
  );
}
