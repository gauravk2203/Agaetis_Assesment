
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, X, Users, Search, RefreshCw } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface EmployeeForm {
  name: string;
  email: string;
  role: string;
}

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

const initialForm: EmployeeForm = {
  name: "",
  email: "",
  role: "",
};

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState<EmployeeForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/employees");
      setEmployees(response.data.data);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to fetch employees"
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchEmployees();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create / Update employee
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.role.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await API.patch(`/employees/${editingId}`, form);
        setSuccess("Employee updated successfully");
      } else {
        await API.post("/employees", form);
        setSuccess("Employee created successfully");
      }

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);

      await fetchEmployees();
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to save employee"
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit employee
  const handleEdit = (employee: Employee) => {
    setForm({
      name: employee.name,
      email: employee.email,
      role: employee.role,
    });

    setEditingId(employee.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // Delete employee
  const handleDelete = async (employee: Employee) => {
    if (!window.confirm(`Delete ${employee.name}?`)) return;

    try {
      setError("");
      setSuccess("");

      await API.delete(`/employees/${employee.id}`);

      setEmployees((prev) =>
        prev.filter((item) => item.id !== employee.id)
      );

      setSuccess("Employee deleted successfully");
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to delete employee"
          : "Something went wrong"
      );
    }
  };

  // Reset form
  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
  };

  // Search employees
  const filteredEmployees = employees.filter((employee) =>
    `${employee.name} ${employee.email} ${employee.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <main className="min-h-screen bg-slate-50 p-5 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Employee Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your organization's employees
            </p>
          </div>

          <button
            onClick={() => {
              closeForm();
              setShowForm(true);
              setError("");
              setSuccess("");
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Employee
          </button>
        </header>

        {/* Statistics */}
        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Employees</p>
              <h2 className="mt-2 text-3xl font-bold">
                {employees.length}
              </h2>
            </div>
            <Users size={30} className="text-blue-600" />
          </div>
        </section>

        {/* Notifications */}
        {error && (
          <div className="flex justify-between rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
            <button onClick={() => setError("")}><X size={16} /></button>
          </div>
        )}

        {success && (
          <div className="flex justify-between rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
            <button onClick={() => setSuccess("")}><X size={16} /></button>
          </div>
        )}

        {/* Employee Form */}
        {showForm && (
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit Employee" : "Add Employee"}
              </h2>

              <button onClick={closeForm}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Employee name"
                className={inputClass}
                required
                minLength={2}
              />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                className={inputClass}
                required
              />

              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Employee role"
                className={inputClass}
                required
              />

              <div className="flex gap-3 md:col-span-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : editingId ? "Update" : "Create"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border px-5 py-2.5 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Employee Directory */}
        <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
            <h2 className="font-semibold">Employee Directory</h2>

            <div className="flex gap-2">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-3 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search employees..."
                  className="w-56 rounded-lg border py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => void fetchEmployees()}
                disabled={loading}
                className="rounded-lg border p-2 hover:bg-slate-50"
                title="Refresh"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          {loading && employees.length === 0 ? (
            <p className="p-10 text-center text-slate-500">
              Loading employees...
            </p>
          ) : filteredEmployees.length === 0 ? (
            <p className="p-10 text-center text-slate-500">
              No employees found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Created</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-slate-50">
                      <td className="p-4 text-slate-500">
                        #{employee.id}
                      </td>
                      <td className="p-4 font-medium">
                        {employee.name}
                      </td>
                      <td className="p-4 text-slate-600">
                        {employee.email}
                      </td>
                      <td className="p-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                          {employee.role}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">
                        {new Date(employee.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => void handleDelete(employee)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
