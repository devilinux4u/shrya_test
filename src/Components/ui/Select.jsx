export function Select({ children }) {
    return <select className="border p-2 rounded">{children}</select>;
  }
  
  export function SelectContent({ children }) {
    return <>{children}</>;
  }
  
  export function SelectItem({ value, children }) {
    return <option value={value}>{children}</option>;
  }
  
  export function SelectTrigger({ children }) {
    return <div className="border p-2 rounded">{children}</div>;
  }
  
  export function SelectValue({ placeholder }) {
    return <span>{placeholder}</span>;
  }