"use client";

import { FILTER_TAG_GROUPS } from "@/lib/productFilterTags";

type ProductFilterCheckboxesProps = {
  selected: string[];
  onToggle: (tag: string) => void;
  /** Hide flower-type group for non-flower primary categories (optional) */
  showFlowerTypes?: boolean;
};

/**
 * Multi-select checkboxes so a product can appear under every matching
 * Flowers / Occasions / Gifts filter and SEO landing.
 */
export default function ProductFilterCheckboxes({
  selected,
  onToggle,
  showFlowerTypes = true,
}: ProductFilterCheckboxesProps) {
  const groups = FILTER_TAG_GROUPS.filter(
    (g) => showFlowerTypes || g.id !== "flower-types"
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-brand-gray-900">
          Where this product should appear
        </h3>
        <p className="text-xs text-brand-gray-600 mt-0.5">
          Tick every category this product fits. Filters and landing pages use these
          checkboxes — if nothing is ticked, the product may not show under those menus.
        </p>
      </div>

      {groups.map((group) => (
        <div key={group.id}>
          <label className="block text-sm font-medium text-brand-gray-900 mb-1">
            {group.label}
          </label>
          <p className="text-xs text-brand-gray-500 mb-2">{group.hint}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border border-brand-gray-300 rounded-lg bg-white max-h-52 overflow-y-auto">
            {group.tags.map((tag) => (
              <label
                key={tag}
                className="flex items-center space-x-2 cursor-pointer hover:bg-brand-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(tag)}
                  onChange={() => onToggle(tag)}
                  className="w-4 h-4 text-brand-green border-brand-gray-300 rounded focus:ring-brand-green"
                />
                <span className="text-sm text-brand-gray-900">{tag}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {selected.length > 0 && (
        <p className="text-xs text-brand-gray-600">
          Selected ({selected.length}): {selected.join(", ")}
        </p>
      )}
    </div>
  );
}
