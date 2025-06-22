import React from "react";

import FilterList from "@/components/FilterList";
import { Category } from "@/types/api";

interface EventsFilterProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number | null) => void;
}

export default function EventsFilter({
  categories,
  selectedCategory,
  onCategorySelect,
}: EventsFilterProps) {
  // Transform categories to match FilterItem interface
  const filterItems = categories.map((category) => ({
    id: category.id,
    name: category.name_en, // You might want to use localized field here
  }));

  return (
    <FilterList
      title="Filter by Category"
      items={filterItems}
      selectedItemId={selectedCategory}
      onItemSelect={onCategorySelect}
      allItemsLabel="All Events"
    />
  );
}
