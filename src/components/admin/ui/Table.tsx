import React from "react";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

const Table: React.FC<TableProps> = ({ children, className = "" }) => {
  return (
    <div className="overflow-x-auto rounded-md">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
        {children}
      </table>
    </div>
  );
};

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

const TableHead: React.FC<TableHeadProps> = ({ children, className = "" }) => {
  return <thead className={`bg-gray-50 ${className}`}>{children}</thead>;
};

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

const TableBody: React.FC<TableBodyProps> = ({ children, className = "" }) => {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  );
};

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const TableRow: React.FC<TableRowProps> = ({
  children,
  className = "",
  onClick,
}) => {
  return (
    <tr
      className={`${
        onClick ? "cursor-pointer hover:bg-gray-50" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  header?: boolean;
}

const TableCell: React.FC<TableCellProps> = ({
  children,
  className = "",
  header = false,
}) => {
  if (header) {
    return (
      <th
        scope="col"
        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
      >
        {children}
      </th>
    );
  }

  return (
    <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>
  );
};

// Export all components
export { Table, TableHead, TableBody, TableRow, TableCell };
