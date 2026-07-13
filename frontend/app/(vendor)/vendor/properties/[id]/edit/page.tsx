import EditPropertyForm from "@/components/EditPropertyForm";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
        <p className="text-gray-500 mt-1">Update your property details, pricing, and images.</p>
      </div>

      <EditPropertyForm propertyId={id} />
    </div>
  );
}
