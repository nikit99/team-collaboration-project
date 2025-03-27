import React, { useEffect, useState } from "react";
import { getUsers, updateUserRole, deleteUser } from "../../api/authapi";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import "./Users.css";
import SideBar from "../../Components/Sidebar/Sidebar";

const User = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [updatedRole, setUpdatedRole] = useState("");
  const [filterRole, setFilterRole] = useState("all"); // State for filtering roles

  const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};
  const isSuperAdmin = loggedInUser.role === "superadmin";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUsers();
        setUsers(userData);
      } catch (err) {
        setError(err.message || "Error fetching users.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (id, currentRole) => {
    if (currentRole === "superadmin") {
      alert("Super Admin role cannot be modified.");
      return;
    }
    setEditingUserId(id);
    setUpdatedRole(currentRole);
  };

  const handleRoleChange = (e) => {
    setUpdatedRole(e.target.value);
  };

  const handleSaveRole = async (id) => {
    try {
      await updateUserRole(id, updatedRole);
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, role: updatedRole } : user
        )
      );
      setEditingUserId(null);
    } catch (error) {
      console.error("Error updating role:", error);
      alert(error.error || "Failed to update role!");
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  const handleDelete = async (id, role) => {
    if (role === "superadmin") {
      alert("Super Admin cannot be deleted.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        setUsers(users.filter((user) => user.id !== id));
        console.log(`Deleted user with ID: ${id}`);
      } catch (error) {
        console.error("Error deleting user:", error);
        alert(error.error || "Failed to delete user!");
      }
    }
  };

  // Filter users based on selected role
  const filteredUsers =
    filterRole === "all" ? users : users.filter((user) => user.role === filterRole);

  return (
    <>
      <SideBar />
      <div className="user-container">
        <h2 className="user-heading">Users List</h2>

        <div className="filter-container">
          <label>Filter by Role:</label>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">All</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>

        {loading ? (
          <p className="loading-message">Loading users...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="user-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  {isSuperAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {editingUserId === user.id ? (
                        <select value={updatedRole} onChange={handleRoleChange}>
                          {user.role === "admin" ? (
                            <>
                              <option value="admin">Admin</option>
                              <option value="user">User</option>
                            </>
                          ) : (
                            <>
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </>
                          )}
                        </select>
                      ) : (
                        user.role
                      )}
                    </td>
                    {isSuperAdmin && (
                      <td className="action-icons">
                        {editingUserId === user.id ? (
                          <>
                            <FaSave
                              className="save-icon"
                              onClick={() => handleSaveRole(user.id)}
                            />
                            <FaTimes
                              className="cancel-icon"
                              onClick={handleCancelEdit}
                            />
                          </>
                        ) : (
                          <>
                            {user.role !== "superadmin" && (
                              <FaEdit
                                className="edit-icon"
                                onClick={() => handleEdit(user.id, user.role)}
                              />
                            )}
                            {user.role !== "superadmin" && (
                              <FaTrash
                                className="delete-icon"
                                onClick={() => handleDelete(user.id, user.role)}
                              />
                            )}
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default User;
