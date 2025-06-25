import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Badge,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Label,
  CreateCategoryModel,
  EditCategoryModel,
} from '@/components';
import type { Category } from '@/types/api/category.type';
import { useEffect, useState } from 'react';
import { CategoryAPI } from '@/api';
import toast from 'react-hot-toast';
import { Layers, Loader2, MoreVertical, Trash2, Edit3 } from 'lucide-react';

const CategoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  useEffect(() => {
    CategoryAPI.getAll()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log('Failed to fetch categories:', error);
        toast.error('Failed to fetch categories');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const deleteCategory = async (id: string) => {
    try {
      setLoading(true);
      const response = await CategoryAPI.deleteCategory(id);
      if (response.success) {
        setCategories((prev) => prev.filter((cat) => cat._id !== id));
        toast.success('Category deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete category');
      }
    } catch (error) {
      console.log('Error deleting category:', error);
      toast.error(
        (error as Error)?.message ||
          'An error occurred while deleting the category'
      );
    } finally {
      setLoading(false);
    }
  };

  const editCategory = (category: Category) => {
    setCategories((prev) =>
      prev.map((cat) => (cat._id === category._id ? category : cat))
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage your transaction categories
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>Add Category</Button>
      </div>

      {/* Categories */}
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="">
            <Loader2 className="text-primary mx-auto h-8 w-8 animate-spin" />
            <div>
              <h3 className="text-lg font-semibold">Loading Categories</h3>
              <p className="text-muted-foreground">
                Please wait while we fetch your categories...
              </p>
            </div>
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-6">
            <Layers />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            No categories found
          </h3>
          <p className="mb-4 text-gray-500">
            Get started by creating your first category
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create Category
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Card
              key={category._id}
              className="cursor-pointer transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="rounded-lg p-2"
                      style={{
                        backgroundColor: `${category.color.hex}20`,
                        border: `2px solid ${category.color.hex}`,
                      }}
                    >
                      <img
                        className="size-6"
                        src={category.icon.url}
                        alt={category.icon.name}
                      />
                    </div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  <Badge
                    className={
                      category.shared
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {category.shared ? 'Shared' : 'Private'}
                  </Badge>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto">
                      <div className="flex flex-col space-y-1">
                        <Label className="mb-2 text-center">Actions</Label>{' '}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => (
                            setSelectedCategory(category),
                            setIsEditModalOpen(true)
                          )}
                        >
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteCategory(category._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <CreateCategoryModel
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(category: Category) => {
          setCategories((prev) => [...prev, category]);
        }}
      />

      {selectedCategory && (
        <EditCategoryModel
          category={selectedCategory!}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={(data) => editCategory(data)}
        />
      )}
    </div>
  );
};

export default CategoryPage;
