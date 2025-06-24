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
import { useState } from 'react';
import type { Color } from '@/types/api/color.types';
import type { Icon } from '@/types/api/icon.types';
import { CategoryAPI } from '@/api';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import type { Category } from '@/types/api/category.type';
import { Switch } from '@/components/ui/switch';

interface CreateCategoryModelProps {
  onClose: () => void;
  onCreate: (data: Category) => void;
  isOpen: boolean;
}

const CreateCategoryModel = ({
  onClose,
  onCreate,
  isOpen,
}: CreateCategoryModelProps) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState<Color | undefined>();
  const [selectedIcon, setSelectedIcon] = useState<Icon | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [shared, setShared] = useState(false);

  const onColorChange = (color: Color) => {
    setSelectedColor(color);
  };

  const onIconChange = (icon: Icon) => {
    setSelectedIcon(icon);
  };

  const resetForm = () => {
    setName('');
    setSelectedColor(undefined);
    setSelectedIcon(undefined);
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

      const response = await CategoryAPI.create({
        name: name.trim(),
        iconId: selectedIcon!._id,
        colorId: selectedColor!._id,
        shared,
      });

      toast.success('Category created successfully!');

      resetForm();

      onCreate(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('An error occurred while creating the category');
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
                Creating category...
              </p>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a New Category</DialogTitle>
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
            </div>
            <div className="grid gap-3">
              <Label>Color</Label>
              <ColorSelector onColorChange={onColorChange} />
            </div>
            <div className="grid gap-3">
              <Label>Icon</Label>
              <IconSelector type="category" onIconChange={onIconChange} />
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
                  Creating...
                </>
              ) : (
                'Create Category'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryModel;
