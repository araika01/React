import { useEffect, useState } from "react";
import { getItemsList, getItem, createItem, updateItem, deleteItem } from "./api/fakeApi";
import "./App.css"

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "",
  status: "available",
  priority: "medium",
  assignee: "",
  createdAt: "",
  updatedAt: "",
  location: "",
};

export default function App() {

  // list
  const [items, setItems] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // selected item and details
  const [selectedId, setSelectedId] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  // create / edit / delete / complete
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  // form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // effect 1: list
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setListLoading(true);
      setListError(null);
      try {
        const res = await getItemsList();
        if (!cancelled) setItems(res.data);
      } catch (e) {
        if (!cancelled) setListError(e.message);
      } finally {
        if (!cancelled) setListLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // effect 2: details
  useEffect(() => {
    if (selectedId == null) {
      setDetails(null);
      setDetailsLoading(false);
      setDetailsError(null);
      return;
    }

    let cancelled = false;
    const requestedId = selectedId;

    async function loadDetails() {
      setDetailsLoading(true);
      setDetailsError(null);
      setDetails(null);

      try {
        const item = await getItem(requestedId);
        if (!cancelled) setDetails(item);
      } catch (e) {
        if (!cancelled) setDetailsError(e.message);
      } finally {
        if (!cancelled) setDetailsLoading(false);
      }
    }

    loadDetails();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  // helpers form 
  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    setActionError(null);
  }

  function openCreate() {
    resetForm();
    setShowForm(true);
  }

  function openEdit() {
    if (!details) return;
    setForm({
      name: details.name ?? "",
      description: details.description ?? "",
      category: details.category ?? "",
      status: details.status ?? "available",
      priority: details.priority ?? "medium",
      assignee: details.assignee ?? "",
      createdAt: details.createdAt ?? "",
      updatedAt: details.updatedAt ?? "",
      location: details.location ?? "",
    });
    setEditingId(details.id);
    setShowForm(true);
    setActionError(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  // create / edit / delete / complete
  async function handleSubmit(e) {
    e.preventDefault();
    setActionLoading(true);
    setActionError(null);

    try {
      if (editingId != null ) {
        const idToUpdate = editingId;

        const payload = {
          ...form,
          updatedAt: new Date().toISOString().slice(0, 10),
        };

        const updated = await updateItem(idToUpdate, payload);

        setItems((prev) => prev.map((it) => (it.id === idToUpdate ? { ...it, ...updated } : it)) );
        setDetails((prev) => prev && prev.id === idToUpdate ? { ...prev, ...updated } : prev );
      } else {
        const payload = {
          ...form,
          createdAt: form.createdAt || new Date().toISOString().slice(0, 10),
          updatedAt: form.createdAt || new Date().toISOString().slice(0, 10),
        };
        const created = await createItem(payload);
        setItems((prev) => [...prev, created]);
        setSelectedId(created.id);
      }
      resetForm();
    } catch (e) {
      setActionError(e.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete item?")) return;
    setActionLoading(true);
    setActionError(null);

    try {
      const idToDelete = id;
      await deleteItem(idToDelete);

      setItems((prev) => prev.filter((it) => it.id !== idToDelete));
      setDetails((prev) => (prev && prev.id === idToDelete ? null : prev));
      setSelectedId((prev) => (prev === idToDelete ? null : prev));
    } catch (e) {
      setActionError(e.message);
    } finally {
      setActionLoading(false);
    }
  }

  // complete 
  async function handleComplete() {
    if (!selectedId) return;
    const idToUpdate = selectedId;

    setActionLoading(true);
    setActionError(null);

    try {
      const updated = await updateItem(idToUpdate, {
        status: "completed",
        updatedAt: new Date().toISOString().slice(0, 10),
      });

      setItems((prev) =>
        prev.map((it) => (it.id === idToUpdate ? { ...it, ...updated } : it))
      );
      setDetails((prev) =>
        prev && prev.id === idToUpdate ? { ...prev, ...updated } : prev
      );
    } catch (e) {
      setActionError(e.message);
    } finally {
      setActionLoading(false);
    }
  }


  // render
  return (
    <div className="app">
      <header className="app-header">
        <h1>Fake API Manager</h1>
        <div className="header-actions">
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            disabled={listLoading}
          >
            {listLoading ? "Loading..." : "Reload"}
          </button>
          <button className="primary" onClick={openCreate}>
            + Create
          </button>
        </div>
      </header>

      {actionError && (
        <div className="banner banner-error">Action error: {actionError}</div>
      )}

      <main className="layout">
         {/* List */}
        <section className="panel">
          <h2>Items</h2>

          {listLoading && <div className="state">List loading...</div>}

          {listError && !listLoading && (
            <div className="state state-error">
              Error: {listError}
              <button onClick={() => setReloadKey((k) => k + 1)}>
                Reload
              </button>
            </div>
          )}

          {!listLoading && !listError && items.length === 0 && (
            <div className="state state-empty">
              List is empty. Create first item.
            </div>
          )}

          {!listLoading && !listError && items.length > 0 && (
            <ul className="item-list">
              {items.map((it) => (
                <li
                  key={it.id}
                  className={
                    "item-row" + (it.id === selectedId ? " selected" : "")
                  }
                  onClick={() => setSelectedId(it.id)}
                >
                  <div className="item-main">
                    <strong>{it.name}</strong>
                    <span className={"badge badge-" + (it.status || "available")}>
                      {it.status || "—"}
                    </span>
                  </div>
                  <div className="item-sub">
                    {it.category || "no category"} · {it.priority} ·{" "}
                    {it.assignee || "unassigned"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

         {/* Details */}
        <section className="panel">
          <h2>Details</h2>

          {selectedId == null && (
            <div className="state state-empty">Choose left item.</div>
          )}

          {selectedId != null && detailsLoading && (
            <div className="state">Details loading...</div>
          )}

          {selectedId != null && detailsError && !detailsLoading && (
            <div className="state state-error">
              Error: {detailsError}
              <button onClick={() => setSelectedId((id) => id)}>
                Reload 
              </button>
            </div>
          )}

          {details && !detailsLoading && (
            <div className="details">
              <div className="details-head">
                <h3>{details.name}</h3>
                <span className={"badge badge-" + (details.status || "available")}>
                  {details.status}
                </span>
              </div>

              <dl>
                <dt>ID</dt>
                <dd>{details.id}</dd>

                <dt>Description</dt>
                <dd>{details.description}</dd>

                <dt>Category</dt>
                <dd>{details.category}</dd>

                <dt>Priority</dt>
                <dd>{details.priority}</dd>

                <dt>Assignee</dt>
                <dd>{details.assignee}</dd>

                <dt>Location</dt>
                <dd>{details.location}</dd>

                <dt>Created</dt>
                <dd>{details.createdAt}</dd>

                <dt>Updated</dt>
                <dd>{details.updatedAt}</dd>
              </dl>

              <div className="details-actions">
                <button onClick={openEdit} disabled={actionLoading}>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(details.id)}
                  disabled={actionLoading}
                  className="danger"
                >
                  Delete
                </button>
                <button
                  className="primary"
                  onClick={handleComplete}
                  disabled={actionLoading || details.status === "completed"}
                >
                  {details.status === "completed" ? "Completed" : "Complete"}
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Form */}
      {showForm && (
        <div className="modal-backdrop" onClick={resetForm}>
          <form
            className="modal"
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{editingId != null ? "Edit item" : "Create item"}</h3>

            
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </label>

            <div className="row">
              <label>
                Category
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                />
              </label>

              <label>
                Priority
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                </select>
              </label>
            </div>

            <div className="row">
              <label>
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="available">available</option>
                  <option value="in-progress">in-progress</option>
                  <option value="completed">completed</option>
                </select>
              </label>

              <label>
                Assignee
                <input
                  name="assignee"
                  value={form.assignee}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label>
              Location
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </label>

            <div className="row">
              <label>
                Created at
                <input
                  type="date"
                  name="createdAt"
                  value={form.createdAt}
                  onChange={handleChange}
                />
              </label>

              <label>
                Updated at
                <input
                  type="date"
                  name="updatedAt"
                  value={form.updatedAt}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={resetForm} disabled={actionLoading}>
                Cancel
              </button>
              <button type="submit" className="primary" disabled={actionLoading}>
                {actionLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
