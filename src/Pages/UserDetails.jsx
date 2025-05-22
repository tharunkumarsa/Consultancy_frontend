import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDetails = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("https://consultancy-backend-qg8d.onrender.com/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("❌ Error fetching users:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 border-b pb-4">
          👤 Registered Users
        </h1>

        {users.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-lg">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                    Username
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                    Phone
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((user, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                      {user.phone}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
