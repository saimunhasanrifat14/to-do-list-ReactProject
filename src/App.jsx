import { getDatabase, onValue, push, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

const App = () => {
  const db = getDatabase();
  const list = [
    {
      id: 1,
      ProductName: "shirt",
      ProductPrice: 400,
    },
    {
      id: 1,
      ProductName: "T Shirt",
      ProductPrice: 900,
    },
    {
      id: 1,
      ProductName: "pent",
      ProductPrice: 500,
    },
  ];

  const [nameinputValue, setnameinputValue] = useState("");
  const [priceinputValue, setpriceinputValue] = useState("");
  const [userDataList, setuserDataList] = useState([]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    if (name == "product") {
      setnameinputValue(value);
    } else if (name == "price") {
      setpriceinputValue(value);
    }
  };

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
  console.log(userDataList);

  const handleSubmit = () => {
    set(push(ref(db, "users/")), {
      productName: nameinputValue,
      ProductPrice: priceinputValue,
    })
      .then((userData) => {
        console.log(userData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const handleDelete = () => {};
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen w-full bg-[#f0f4f8] p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
          {/* Form */}
          <div className="flex flex-col gap-6 mb-8">
            <input
              name="product"
              onChange={handleInput}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
              placeholder="Product Name"
            />
            <input
              type="number"
              name="price"
              onChange={handleInput}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
              placeholder="Product Price"
            />
            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all font-semibold cursor-pointer"
            >
              Add Product
            </button>
          </div>

          {/* List */}
          <div className="flex flex-col gap-4 max-h-[375px] overflow-y-auto pr-2 scroll-smooth scrollbar-hide">
            {userDataList.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between w-full bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all"
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
                  onClick={() => handleDelete(index)}
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
