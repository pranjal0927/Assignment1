import axios from "axios";
import React, { useEffect, useState } from "react";

interface ProductType {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
}

function Main() {
  const [productData, setProductData] = useState<ProductType[]>([]);
  const [searchItem, setSearchItem] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [page, setPage] = useState<number>(1);
  const [itemPerPage, setItemPerPage] = useState<number>(10);

  // Search Handler
  const SearchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  const debounce = (func: Function, delay: number) => {
    let timeOutId: NodeJS.Timeout;
    return (...args: any[]) => {
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
        const response = await axios.get("https://dummyjson.com/products");
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

  // checkbox handler
  const checkBoxSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // DeleteHandler
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
        className="container my-5 p-3 d-flex justify-content-center align-items-center"
        placeholder="Search your Product name...."
        value={searchItem}
        onChange={SearchHandler}
      />

      <div style={{ marginLeft: "100px", marginBottom: "20px" }}>
        {selectedIds.length > 0
          ? `${selectedIds.length} row(s) selected`
          : "No rows selected"}
      </div>

      <table className="table container">
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
      <div className="container">
        <div className="row align-item-center justify-content-center ">
          <div className="col">
            <button className="btn btn-danger " onClick={deleteHandler}>
              Delete
            </button>
          </div>
          <div className="col">
            <div className="pagination ">
              <button
                className="btn btn-secondary"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
              <span className="d-flex justify-content-center align-items-center">
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-secondary "
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
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
