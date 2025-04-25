import { getDatabase, onValue, push, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";

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
           userProductlist.push({...item.val(), productKey: item.key})
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


  const handleDelete = () => {};
  return (
    <div className=" h-screen w-full flex items-center justify-center">
      <div className="h-full w-[50%] flex items-center justify-center">
        <div className="flex flex-col gap-5 items-center">
          <div className="flex flex-col gap-4">
            <input
              name="product"
              onChange={handleInput}
              className="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700  transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2"
              placeholder="Product Name"
            />
            <input
              name="price"
              onChange={handleInput}
              className="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700  transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2"
              placeholder="Price"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="py-3 px-6 bg-red-400 rounded text-white cursor-pointer"
          >
            submit
          </button>
        </div>
      </div>
      <div className="h-full w-[50%] bg-blue-400">
        <div className="flex items-center flex-col justify-center h-full">
          {userDataList.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 items-center justify-center py-5 px-8  my-3"
            >
              <span>{item.productName}</span>
              <span>{item.ProductPrice}</span>
              <button
                onClick={handleDelete}
                className="bg-red-400 py-4 px-8 text-white cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
