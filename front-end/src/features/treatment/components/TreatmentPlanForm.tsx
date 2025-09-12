"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { TreatmentPlanFormValues } from "@/features/treatment/schemas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronsUpDown, Plus, PlusCircle, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { addCategory } from "@/features/category/api/category.api";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { useServices } from "@/features/service/hooks/useServices";
import { useCategories } from "@/features/category/hooks/useCategories";
import CategoryForm from "@/features/category/components/CategoryForm";

export default function TreatmentPlanFormFields() {
  const queryClient = useQueryClient();
  const { control, watch, setValue, formState } =
    useFormContext<TreatmentPlanFormValues>();
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(() =>
    control._getWatch("price")
      ? new Intl.NumberFormat("vi-VN").format(control._getWatch("price") / 1000)
      : ""
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  const { data: categories = [] } = useCategories();
  const { data: services = [] } = useServices();
  const treatmentCategories = categories.filter((c) => c.type === "treatment");
  const selectedCategories = watch("categories") || [];

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "price" && value.price !== undefined) {
        const currentNumericPrice =
          parseFloat(displayPrice.replace(/[^0-9]/g, "")) * 1000;
        if (value.price !== currentNumericPrice) {
          setDisplayPrice(
            new Intl.NumberFormat("vi-VN").format(value.price / 1000)
          );
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, displayPrice]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const numberValue = parseInt(rawValue, 10) || 0;
    setValue("price", numberValue * 1000, { shouldValidate: true });
  };

  const addCategoryMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(`Đã thêm danh mục "${newCategory.name}"!`);
      const currentCategories = watch("categories") || [];
      setValue("categories", [...currentCategories, newCategory.name]);
      setIsAddCategoryOpen(false);
    },
    onError: (err) => toast.error(`Thêm thất bại: ${err.message}`),
  });

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên liệu trình</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="categories"
        render={() => (
          <FormItem>
            <FormLabel>Danh mục</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between h-auto min-h-9"
                  >
                    <div className="flex gap-1 flex-wrap">
                      {selectedCategories.length > 0
                        ? selectedCategories.map((catName) => (
                            <Badge key={catName} variant="secondary">
                              {catName}
                            </Badge>
                          ))
                        : "Chọn danh mục..."}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <div className="p-2 space-y-1">
                  {treatmentCategories.map((category) => (
                    <FormField
                      key={category.id}
                      control={control}
                      name="categories"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(category.name)}
                              onCheckedChange={(checked) => {
                                const currentValues = field.value || [];
                                return checked
                                  ? field.onChange([
                                      ...currentValues,
                                      category.name,
                                    ])
                                  : field.onChange(
                                      currentValues.filter(
                                        (value) => value !== category.name
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {category.name}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <Separator />
                <Dialog
                  open={isAddCategoryOpen}
                  onOpenChange={setIsAddCategoryOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-t-none"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm danh mục mới
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tạo danh mục liệu trình mới</DialogTitle>
                    </DialogHeader>
                    <CategoryForm
                      categoryType="treatment"
                      onFormSubmit={(data) => addCategoryMutation.mutate(data)}
                      onClose={() => setIsAddCategoryOpen(false)}
                      isSubmitting={addCategoryMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="price"
          render={() => (
            <FormItem>
              <FormLabel>Giá liệu trình</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    value={displayPrice}
                    onChange={handlePriceChange}
                    className="pr-12"
                  />
                </FormControl>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-muted-foreground">.000 VND</span>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormLabel>Các buổi trong liệu trình</FormLabel>
        <div className="space-y-4 mt-2">
          {fields.map((field, index) => (
            <div key={field.id} className="border p-4 rounded-md relative">
              <FormLabel className="mb-2 block">Buổi {index + 1}</FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              <FormField
                control={control}
                name={`steps.${index}.serviceIds`}
                render={({ field: stepField }) => (
                  <FormItem>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between h-auto min-h-9"
                          >
                            <div className="flex gap-1 flex-wrap">
                              {stepField.value?.length > 0
                                ? stepField.value.map((serviceId) => {
                                    const service = services.find(
                                      (s) => s.id === serviceId
                                    );
                                    return (
                                      <Badge
                                        key={serviceId}
                                        variant="secondary"
                                      >
                                        {service?.name || "..."}
                                      </Badge>
                                    );
                                  })
                                : "Chọn dịch vụ..."}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
                          {services.map((service) => (
                            <FormItem
                              key={service.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={stepField.value?.includes(
                                    service.id
                                  )}
                                  onCheckedChange={(checked) => {
                                    const currentIds = stepField.value || [];
                                    return checked
                                      ? stepField.onChange([
                                          ...currentIds,
                                          service.id,
                                        ])
                                      : stepField.onChange(
                                          currentIds.filter(
                                            (id) => id !== service.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {service.name}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ serviceIds: [] })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm buổi
          </Button>
        </div>
        <FormMessage>
          {formState.errors.steps?.root?.message ||
            formState.errors.steps?.message}
        </FormMessage>
      </div>

      <FormField
        control={control}
        name="imageFile"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hình ảnh liệu trình (Tùy chọn)</FormLabel>
            <FormControl>
              <ImageUploader onFileSelect={(file) => field.onChange(file)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
