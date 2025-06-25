import { Label } from '@/components';

interface PageSizeSelectorProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  options?: number[];
}

const PageSizeSelector = ({
  pageSize,
  onPageSizeChange,
  options = [5, 10, 20, 50],
}: PageSizeSelectorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="page-size" className="text-sm font-medium">
        Show:
      </Label>
      <select
        id="page-size"
        className="border-input bg-background w-auto rounded-md border px-3 py-1 text-sm"
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-muted-foreground text-sm">per page</span>
    </div>
  );
};
export default PageSizeSelector;
