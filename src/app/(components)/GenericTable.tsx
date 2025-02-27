import React from 'react';

interface GenericTableProps<T> {
  data: T[];
  columns: { key: keyof T; label: string }[];
  actions?: (item: T) => React.ReactNode;
}

const GenericTable = <T,>({ data, columns, actions }: GenericTableProps<T>) => {
  return (
    <div className="w-full text-sm">
      <table className="w-full bg-white">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="py-2 px-4 border-b">
                {column.label}
              </th>
            ))}
            {actions && <th className="py-2 px-4 border-b">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={String(column.key)} className="py-2 px-4 border-b">
                  {String(item[column.key])}
                </td>
              ))}
              {actions && (
                <td className="py-2 px-4 border-b">
                  <div className="flex flex-wrap gap-2">
                    {actions(item)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GenericTable;