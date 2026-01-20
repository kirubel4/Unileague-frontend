import { Construction } from "lucide-react";

type UnderConstructionProps = {
  title?: string;
  description?: string;
  estimatedDate?: string;
};

export default function UnderConstruction({
  title = "Page Under Construction",
  description = "We’re working hard to bring this feature to you.",
  estimatedDate,
}: UnderConstructionProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
          <Construction className="h-6 w-6 text-yellow-600" />
        </div>

        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

        <p className="mt-2 text-sm text-gray-600">{description}</p>

        {estimatedDate && (
          <p className="mt-4 text-sm text-gray-500">
            ⏳ Estimated completion:{" "}
            <span className="font-medium text-gray-700">{estimatedDate}</span>
          </p>
        )}
      </div>
    </div>
  );
}
