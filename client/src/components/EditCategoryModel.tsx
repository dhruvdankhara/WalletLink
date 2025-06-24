/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ColorSelector from './ColorSelector';
import IconSelector from './IconSelector';
import { useState, useEffect } from 'react';
import type { Color } from '@/types/api/color.types';
import type { Icon } from '@/types/api/icon.types';
import { CategoryAPI } from '@/api';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import type { Category } from '@/types/api/category.type';
import { Switch } from '@/components/ui/switch';

interface EditCategoryModelProps {
  category: Category;
  onClose: () => void;
  onEdit: (data: Category) => void;
  isOpen: boolean;
}

const EditCategoryModel = ({
  category,
  onClose,
  onEdit,
  isOpen,
}: EditCategoryModelProps) => {
  const [name, setName] = useState(category.name);
  const [selectedColor, setSelectedColor] = useState<Color>(category.color);
  const [selectedIcon, setSelectedIcon] = useState<Icon>(category.icon);
  const [isLoading, setIsLoading] = useState(false);
  const [shared, setShared] = useState(category.shared);

  useEffect(() => {
    setName(category.name);
    setSelectedColor(category.color);
    setSelectedIcon(category.icon);
    setShared(category.shared);
  }, [category]);

  const onColorChange = (color: Color) => {
    setSelectedColor(color);
  };

  const onIconChange = (icon: Icon) => {
    setSelectedIcon(icon);
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Please enter a category name');
      return false;
    }

    if (!selectedColor) {
      toast.error('Please select a color');
      return false;
    }

    if (!selectedIcon) {
      toast.error('Please select an icon');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await CategoryAPI.update(category._id, {
        name: name.trim(),
        iconId: selectedIcon!._id,
        colorId: selectedColor!._id,
        shared,
      });

      toast.success('Category updated successfully!');

      onEdit(response.data);
      onClose();
    } catch (error: any) {
      console.log('Error updating category:', error);
      toast.error(
        error?.message || 'An error occurred while updating the category'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
      <DialogContent className="sm:max-w-[425px]">
        {isLoading && (
          <div className="bg-background/80 absolute inset-0 z-50 flex items-center justify-center rounded-lg backdrop-blur-sm">
            <div className="space-y-2 text-center">
              <Loader2 className="text-primary mx-auto h-6 w-6 animate-spin" />
              <p className="text-muted-foreground text-sm">
                Updating category...
              </p>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="my-6 grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="category">Category Name</Label>
              <Input
                id="category"
                name="category"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="shared">Shared</Label>
              <Switch
                id="shared"
                checked={shared}
                onCheckedChange={setShared}
              />
            </div>{' '}
            <div className="grid gap-3">
              <Label>Color</Label>
              <ColorSelector
                onColorChange={onColorChange}
                initialColor={selectedColor}
              />
            </div>
            <div className="grid gap-3">
              <Label>Icon</Label>
              <IconSelector
                type="category"
                onIconChange={onIconChange}
                initialIcon={selectedIcon}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Category'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModel;
