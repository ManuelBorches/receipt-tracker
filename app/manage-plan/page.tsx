import { SchematicComponet } from "@/components/schematic/SchematicComponet";

const ManagePlan = () => {
  return (
    <div className="container xl:max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 my-8">Manage Your Plan</h1>

      <p className="text-gray-600 mb-8">
        You can manage your subscription and billing here. If you have any
        questions, please contact support.
      </p>

      <SchematicComponet
        componentId={
          process.env.NEXT_PUBLIC_SCHEMATIC_CUSTOMER_PORTAL_COMPANY_ID
        }
      />
    </div>
  );
};

export default ManagePlan;
