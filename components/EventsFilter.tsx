import React from "react";

import FilterList from "@/components/FilterList";
import { Municipality } from "@/types/api";

interface EventsFilterProps {
  municipalities: Municipality[];
  selectedMunicipality: number | null;
  onMunicipalitySelect: (municipalityId: number | null) => void;
}

export default function EventsFilter({
  municipalities,
  selectedMunicipality,
  onMunicipalitySelect,
}: EventsFilterProps) {
  // Filter municipalities that have events (you may want to add has_events field later)
  const municipalitiesWithEvents = municipalities || [];

  return (
    <FilterList
      title="Filter by Municipality"
      items={municipalitiesWithEvents}
      selectedItemId={selectedMunicipality}
      onItemSelect={onMunicipalitySelect}
      allItemsLabel="All Municipalities"
    />
  );
}
