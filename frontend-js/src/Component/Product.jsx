import axios from "axios";
import React, { useEffect, useState } from "react";

function Main() {
  const [productData, setProductData] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [itemPerPage] = useState(10);

  // Search Handler
  const SearchHandler = (event) => {
    setSearchItem(event.target.value);
  };

  // Filter products based on search item
  const filterProducts = () => {
    const results = productData.filter((item) =>
      item.title.toLowerCase().includes(searchItem.toLowerCase())
    );
    setFilteredProducts(results);
  };

  // Debounce function
  const debounce = (func, delay) => {
    let timeOutId;
    return (...args) => {
      if (timeOutId) clearTimeout(timeOutId);
      timeOutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Fetch data from Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:8080/products");
        setProductData(response.data.products);
        setFilteredProducts(response.data.products);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const debouncedFilter = debounce(filterProducts, 300);

  useEffect(() => {
    debouncedFilter();
  }, [searchItem]);

  // Checkbox handler
  const checkBoxSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Delete handler
  const deleteHandler = () => {
    setFilteredProducts((prev) =>
      prev.filter((item) => !selectedIds.includes(item.id))
    );
    setSelectedIds([]);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemPerPage);
  const indexOfLastItem = page * itemPerPage;
  const indexOfFirstProduct = indexOfLastItem - itemPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastItem
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search your Product name...."
        value={searchItem}
        onChange={SearchHandler}
      />

      <div style={{ marginLeft: "100px", marginBottom: "20px" }}>
        {selectedIds.length > 0
          ? `${selectedIds.length} row(s) selected`
          : "No rows selected"}
      </div>

      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={() => {
                  const allSelected =
                    filteredProducts.length === selectedIds.length;
                  setSelectedIds(
                    allSelected ? [] : filteredProducts.map((item) => item.id)
                  );
                }}
                checked={
                  selectedIds.length === currentProducts.length &&
                  currentProducts.length > 0
                }
              />
            </th>
            <th>Id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Category</th>
            <th>Price</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((item) => (
            <tr
              key={item.id}
              style={{
                backgroundColor: selectedIds.includes(item.id)
                  ? "gray"
                  : "white",
              }}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => checkBoxSelect(item.id)}
                />
              </td>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{item.category}</td>
              <td>{item.price}</td>
              <td>{item.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <div>
          <div>
            <button onClick={deleteHandler}>Delete</button>
          </div>
          <div>
            <div>
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
