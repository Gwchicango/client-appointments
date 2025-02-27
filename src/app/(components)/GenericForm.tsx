import React from 'react';
import { useRouter } from 'next/navigation';

interface GenericFormProps<T> {
  data: T;
  loading: boolean;
  error: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  fields: { name: keyof T; label: string; type: string; options?: { value: string; label: string }[] }[];
  title: string;
}

const GenericForm = <T,>({ data, loading, error, handleChange, handleSubmit, fields, title }: GenericFormProps<T>) => {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto border border-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div className="mb-6" key={String(field.name)}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  name={String(field.name)}
                  value={String(data[field.name]) || ''}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                  required
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={String(field.name)}
                  value={String(data[field.name]) || ''}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                  required
                />
              )}
            </div>
          ))}
        </div>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white py-2 px-4 rounded-xl hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 shadow-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-400 to-blue-500 text-white py-2 px-4 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Procesando...
              </div>
            ) : (
              'Enviar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenericForm;