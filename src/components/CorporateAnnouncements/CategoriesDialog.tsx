import React, { useCallback, useEffect, useRef, useState } from "react";

import styles from "./styles.module.scss";

interface Category {
  includeCaseSensitive: string;
  priorityRanking: number;
  categoryName: string;
  createdDate: number;
  exclude: string;
  include: string;
  id: number;
}

interface CategoriesComponentProps {
  setSelectedCategories: any;
  selectedCategories: any;
  showCategories: boolean;
  categories: Category[];
  onApply: any;
}

const CategoriesComponent: React.FC<CategoriesComponentProps> = ({
  setSelectedCategories,
  selectedCategories,
  showCategories,
  categories,
  onApply,
}) => {
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleClickOutside = useCallback(
    (event: any) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onApply(false);
      }
    },
    [onApply],
  );

  const handleEscapeKey = useCallback(
    (event: any) => {
      if (event.key === "Escape") {
        onApply(false);
      }
    },
    [onApply],
  );

  useEffect(() => {
    if (showCategories) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showCategories, handleClickOutside, handleEscapeKey]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleCheckboxChange = (categoryName: string) => {
    setSelectedCategories((prevSelected: any) =>
      prevSelected.includes(categoryName)
        ? prevSelected.filter((name: any) => name !== categoryName)
        : [...prevSelected, categoryName],
    );
  };

  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchQuery),
  );

  const applyFun = () => {
    onApply();
  };

  return (
    <div className={`customModule`}>
      <div className="moduleWrap">
        <div className={styles.categoriesComponent} ref={popupRef}>
          <input
            type="search"
            placeholder="Search Categories"
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <label className={styles.categoryHeading}>Categories</label>
          <div className={styles.categoriesList}>
            {filteredCategories.map((category) => (
              <div key={category.id} className={styles.categoryItem}>
                <label>
                  {category.categoryName}
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(
                      category?.categoryName,
                    )}
                    onChange={() =>
                      handleCheckboxChange(category?.categoryName)
                    }
                  />
                </label>
              </div>
            ))}
            {!filteredCategories?.length && (
              <div className={styles.categoryItem}>
                <label>No Cateogry found with this filter.</label>
              </div>
            )}
          </div>
          <div className={styles.stickyFooter}>
            <span>
              <strong>{selectedCategories?.length}</strong> Category Selected
            </span>
            <button onClick={applyFun}>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesComponent;
