import React, { useState, useEffect } from 'react';
import { IconAPI } from '@/api';
import type { Icon } from '@/types/api/icon.types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from './ui/button';

interface IconSelectorProps {
  onIconChange: (icon: Icon) => void;
  type: 'account' | 'category';
  label?: string;
  initialIcon?: Icon;
}

const IconSelector: React.FC<IconSelectorProps> = ({
  onIconChange,
  type,
  initialIcon,
}) => {
  const [selectedIcon, setSelectedIcon] = useState<Icon | undefined>(
    initialIcon
  );
  const [icons, setIcons] = useState<Icon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialIcon) {
      setSelectedIcon(initialIcon);
    }
  }, [initialIcon]);

  const handleIconChange = (icon: Icon) => {
    setSelectedIcon(icon);
    onIconChange(icon);
  };

  useEffect(() => {
    setIsLoading(true);
    IconAPI.getAll({ type })
      .then((response) => {
        setIcons(response.data);
      })
      .catch((error) => {
        console.error('Error fetching icons:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [type]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground text-sm">Loading icons...</div>
      </div>
    );
  }

  return (
    <div>
      {icons.length === 0 ? (
        <div className="col-span-6 py-4 text-center">
          <p className="text-muted-foreground text-sm">
            No {type} icons available
          </p>
        </div>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex h-10 w-full items-center justify-center gap-2 p-2"
            >
              {selectedIcon ? (
                <>
                  <img
                    src={selectedIcon.url}
                    alt={selectedIcon.name}
                    className="h-5 w-5 object-contain"
                  />
                  <span className="truncate text-sm">{selectedIcon.name}</span>
                </>
              ) : (
                <>
                  <div className="border-muted-foreground/50 h-5 w-5 rounded border-2 border-dashed" />
                  <span className="text-muted-foreground text-sm">
                    Select Icon
                  </span>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <div className="bg-muted/20 grid grid-cols-6 gap-3">
              {icons.map((icon) => (
                <button
                  key={icon._id}
                  type="button"
                  className={`flex size-10 items-center justify-center rounded-lg border-2 transition-all hover:scale-105 hover:shadow-md ${
                    selectedIcon?._id === icon._id
                      ? 'border-primary bg-primary/10 scale-110 shadow-md'
                      : 'border-border bg-background hover:border-primary/50'
                  } `}
                  onClick={() => handleIconChange(icon)}
                  title={icon.name}
                  aria-label={`Select ${icon.name} icon`}
                >
                  <img
                    src={icon.url}
                    alt={icon.name}
                    className="h-6 w-6 object-contain"
                  />
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {icons.length === 0 && !isLoading && (
        <p className="text-muted-foreground text-xs">
          No icons found for type "{type}". Please check your data.
        </p>
      )}
    </div>
  );
};

export default IconSelector;
