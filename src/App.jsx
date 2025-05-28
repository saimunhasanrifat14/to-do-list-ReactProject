import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaTrash } from "react-icons/fa";

const App = () => {
  const db = getDatabase();
  const [userDataList, setuserDataList] = useState([]);

  const finalData = [...userDataList].reverse();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Load Data
  useEffect(() => {
    const fatchdata = () => {
      const UserRef = ref(db, "users/");
      onValue(UserRef, (snapshot) => {
        let userProductlist = [];
        snapshot.forEach((item) => {
          userProductlist.push({ ...item.val(), productKey: item.key });
        });
        setuserDataList(userProductlist);
      });
    };
    fatchdata();
  }, []);

  // Add Data
  const onSubmit = (data) => {
    set(push(ref(db, "users/")), {
      productName: data.product,
      ProductPrice: data.price,
    })
      .then(() => {
        reset(); // reset input
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Delete Data
  const handleDelete = (item) => {
    const reference = ref(db, `users/${item.productKey}`);
    remove(reference);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen w-full bg-[#f0f4f8] p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6 mb-8">
              <div>
                <input
                  {...register("product", {
                    required: "Product name is required",
                  })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
                  placeholder="Product Name"
                />
                {errors.product && (
                  <p className="text-red-400 text-sm">
                    {errors.product.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="number"
                  {...register("price", {
                    required: "Product price is required",
                  })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
                  placeholder="Product Price"
                />
                {errors.price && (
                  <p className="text-red-400 text-sm">{errors.price.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all font-semibold cursor-pointer"
              >
                Add Product
              </button>
            </div>
          </form>

          {/* List */}
          <div className="flex flex-col gap-4 max-h-[375px] overflow-y-auto pr-2 scroll-smooth scrollbar-hide">
            {finalData.map((item, index) => (
              <div
                key={index}
                className={
                  index === finalData.length - 1
                    ? "mb-2 flex items-center justify-between w-full bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all"
                    : "flex items-center justify-between w-full bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all"
                }
              >
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">
                    {item.productName}
                  </span>
                  <span className="text-sm text-gray-500">
                    ${item.ProductPrice}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(item)}
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-all cursor-pointer"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
