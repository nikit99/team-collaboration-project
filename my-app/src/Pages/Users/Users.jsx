import React, { useEffect, useState } from 'react';
import { getUsers, updateUserRole, deleteUser } from '../../api/authApi';
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSortUp,
  FaSortDown,
} from 'react-icons/fa';
import Pagination from '../../Components/Pagination/Pagination';
import Select from 'react-select';
import './Users.css';

const User = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [updatedRole, setUpdatedRole] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    search: '',
    ordering: 'name',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
    next: null,
    previous: null,
  });

  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  const isSuperAdmin = loggedInUser.role === 'superadmin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getUsers(
          filters,
          pagination.currentPage,
          pagination.pageSize
        );
        console.log('API Response:', response);
        setUsers(response.users);
        if (response.pagination) {
          setPagination((prev) => ({
            ...prev,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages,
            next: response.pagination.next,
            previous: response.pagination.previous,
          }));
        }
      } catch (err) {
        setError(err.message || 'Error fetching users.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters, pagination.currentPage]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSort = (field) => {
    const direction = filters.ordering === field ? `-${field}` : field;
    handleFilterChange('ordering', direction);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleEdit = (id, currentRole) => {
    if (currentRole === 'superadmin') {
      alert('Super Admin role cannot be modified.');
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
      console.error('Error updating role:', error);
      alert(error.response?.data?.error || 'Failed to update role!');
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  const handleDelete = async (id, role) => {
    if (role === 'superadmin') {
      alert('Super Admin cannot be deleted.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter((user) => user.id !== id));
        const response = await getUsers(
          filters,
          pagination.currentPage,
          pagination.pageSize
        );
        setUsers(response.users);
        if (response.pagination) {
          setPagination((prev) => ({
            ...prev,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages,
          }));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(error.response?.data?.error || 'Failed to delete user!');
      }
    }
  };

  const getSortIcon = (field) => {
    if (filters.ordering === field) return <FaSortUp />;
    if (filters.ordering === `-${field}`) return <FaSortDown />;
    return '';
  };

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
    { value: 'superadmin', label: 'Super Admin' },
  ];

  const editRoleOptions = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
  ];

  return (
    <div className="user-container">
      <h2 className="user-heading">Team Members List</h2>

      <div className="filter-container">
        <div className="filter-group">
          <label>Filter by Role:</label>
          <Select
            options={roleOptions}
            value={roleOptions.find((option) => option.value === filters.role)}
            onChange={(selectedOption) => {
              handleFilterChange('role', selectedOption.value);
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
            }}
            //classNamePrefix="select"
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Select role..."
            isSearchable={true}
            menuPortalTarget={document.body}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: '38px', // Match your search input height
                width: '150px', // Match your search input width
                fontSize: '14px',
                border: '1px solid #ced4da',
                boxShadow: 'none',
              }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              dropdownIndicator: (base) => ({
                ...base,
                padding: '4px',
              }),
            }}
          />
        </div>

        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            className="search-input"
            placeholder="Enter Name"
            value={filters.search}
            onChange={(e) => {
              handleFilterChange('search', e.target.value);
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
            }}
          />
        </div>
      </div>

      {loading ? (
        <p className="loading-message">Loading users...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : users.length === 0 ? (
        <p className="no-results">No users found matching your criteria</p>
      ) : (
        <>
          <div className="user-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>S No.</th>
                  <th>
                    <div
                      className="sortable-header"
                      onClick={() => handleSort('name')}
                    >
                      Name
                      <span className="sort-icon">{getSortIcon('name')}</span>
                    </div>
                  </th>
                  <th onClick={() => handleSort('email')}>
                    Email{getSortIcon('email')}
                  </th>
                  <th onClick={() => handleSort('role')}>
                    Role{getSortIcon('role')}
                  </th>
                  {isSuperAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>
                      {(pagination.currentPage - 1) * pagination.pageSize +
                        index +
                        1}
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    {/* <td>
  {editingUserId === user.id ? (
    <Select
      options={editRoleOptions}
      value={editRoleOptions.find(option => option.value === updatedRole)}
      onChange={(selectedOption) => setUpdatedRole(selectedOption.value)}
      className="react-select-container"
      classNamePrefix="react-select"
      menuPortalTarget={document.body}
      styles={{
        control: (base) => ({
          ...base,
          minHeight: '30px',
          height: '30px',
          width: '100px',
          fontSize: '14px',
          border: '1px solid #ced4da',
          boxShadow: 'none',
        }),
        valueContainer: (base) => ({
          ...base,
          padding: '0 1px',
          height: '30px',
        }),
        input: (base) => ({
          ...base,
          margin: '0',
          padding: '0',
        }),
        dropdownIndicator: (base) => ({
          ...base,
          padding: '1px',
        }),
        indicatorSeparator: (base) => ({
          ...base,
          margin: '1px 0',
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 }),
      }}
    />
  ) : (
    <span className={`role-badge role-${user.role}`}>
      {user.role}
    </span>
  )}
</td> */}
                    <td>
                      {editingUserId === user.id ? (
                        <Select
                          options={editRoleOptions}
                          value={editRoleOptions.find(
                            (option) => option.value === updatedRole
                          )}
                          onChange={(selectedOption) =>
                            setUpdatedRole(selectedOption.value)
                          }
                          className="react-select-container"
                          classNamePrefix="react-select"
                          menuPortalTarget={document.body}
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: '30px',
                              height: '30px',
                              width: '100px',
                              fontSize: '14px',
                              border: '1px solid #ced4da',
                              boxShadow: 'none',
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              padding: '0 1px',
                              height: '30px',
                            }),
                            input: (base) => ({
                              ...base,
                              margin: '0',
                              padding: '0',
                            }),
                            dropdownIndicator: (base) => ({
                              ...base,
                              padding: '1px',
                            }),
                            indicatorSeparator: (base) => ({
                              ...base,
                              margin: '1px 0',
                            }),
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      ) : (
                        <span className={`role-badge role-${user.role}`}>
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}{' '}
                          {/* Capitalize first letter */}
                        </span>
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
                            {user.role !== 'superadmin' && (
                              <FaEdit
                                className="edit-icon"
                                onClick={() => handleEdit(user.id, user.role)}
                              />
                            )}
                            {user.role !== 'superadmin' && (
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

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default User;
