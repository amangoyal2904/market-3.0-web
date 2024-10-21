import React, { useState } from "react";
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
  categories: Category[];
}

const CategoriesComponent: React.FC<CategoriesComponentProps> = ({
  categories,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allSelected, setAllSelected] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleCheckboxChange = (categoryId: number) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId],
    );
    if (selectedCategories?.length) {
      setAllSelected(false);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchQuery),
  );

  const selectAllFun = () => {
    if (!allSelected) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([]);
    }
    setAllSelected(!allSelected);
  };

  const applyFun = () => {
    console.log(selectedCategories, "Selected Cateoghrues");
  };

  return (
    <div className={`customModule`}>
      <div className="moduleWrap">
        <div className={styles.categoriesComponent}>
          <input
            type="search"
            placeholder="Search Categories"
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <label className={styles.categoryHeading}>
            Categories
            <input
              type="checkbox"
              checked={allSelected}
              onChange={selectAllFun}
            />
          </label>
          <div className={styles.categoriesList}>
            {filteredCategories.map((category) => (
              <div key={category.id} className={styles.categoryItem}>
                <label>
                  {category.categoryName}
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCheckboxChange(category.id)}
                  />
                </label>
              </div>
            ))}
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
