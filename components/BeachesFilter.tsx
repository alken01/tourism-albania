import React from "react";

import FilterList from "@/components/FilterList";

interface Municipality {
  id: number;
  name: string;
  has_beaches?: boolean;
}

interface BeachesFilterProps {
  municipalities: Municipality[];
  selectedMunicipality: number | null;
  onMunicipalitySelect: (municipalityId: number | null) => void;
}

export default function BeachesFilter({
  municipalities,
  selectedMunicipality,
  onMunicipalitySelect,
}: BeachesFilterProps) {
  const beachesWithMunicipalities =
    municipalities?.filter((m) => m.has_beaches) || [];

  return (
    <FilterList
      title="Filter by Municipality"
      items={beachesWithMunicipalities}
      selectedItemId={selectedMunicipality}
      onItemSelect={onMunicipalitySelect}
      allItemsLabel="All Beaches"
    />
  );
}
