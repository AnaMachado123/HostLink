import { useEffect, useMemo, useState } from 'react';
import styles from './Services.module.css';

export default function Services() {
  const [services, setServices] = useState([]);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    valor: '',
    id_tiposervico: 1,
    priceType: 'hourly'
  });

  /* ================= LOAD SERVICES ================= */
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.warn('No token found, skipping services fetch');
        return;
      }

      const res = await fetch('http://localhost:5000/servicos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 403) {
        console.warn('403 – token may be outdated');
        return;
      }

      if (!res.ok) {
        console.error('Erro ao carregar serviços:', res.status);
        return;
      }

      const data = await res.json();

      setServices(
        data.map(s => ({
          id: s.id_servico,
          nome: s.nome,
          descricao: s.descricao,
          valor: s.valor,
          id_tiposervico: s.id_tiposervico,
          priceType: s.tipo_preco
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= HELPERS ================= */
  const getCategoryName = (id) => {
    if (id === 1) return 'Cleaning';
    if (id === 2) return 'Maintenance';
    if (id === 3) return 'Transport';
    return '';
  };

  const getCategoryClass = (id) => {
    if (id === 1) return styles.categoryCleaning;
    if (id === 2) return styles.categoryMaintenance;
    if (id === 3) return styles.categoryTransport;
    return '';
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      valor: '',
      id_tiposervico: 1,
      priceType: 'hourly'
    });
    setEditingId(null);
  };

  /* ================= CREATE / EDIT ================= */
  const handleSave = async () => {
  if (
    !formData.nome ||
    !formData.descricao ||
    !String(formData.valor).trim() ||
    !formData.priceType
  ) {
    alert('Please fill all required fields.');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return; // não força login, apenas aborta
  }

  const normalizedValue = Number(String(formData.valor).replace(',', '.'));
  if (Number.isNaN(normalizedValue)) {
    alert('Invalid price value');
    return;
  }

  const payload = {
    nome: formData.nome,
    descricao: formData.descricao,
    valor: normalizedValue,
    idTipoServico: formData.id_tiposervico,
    tipo_preco: formData.priceType
  };

  try {
    const url = editingId
      ? `http://localhost:5000/servicos/${editingId}`
      : 'http://localhost:5000/servicos';

    const method = editingId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    // 🔥 aqui está a correção
    if (res.status === 403) {
      console.warn('403 while saving service – token still outdated');
      return; // sem alert, sem logout, sem refresh
    }

    if (!res.ok) throw new Error();

    await fetchServices();
    setShowModal(false);
    resetForm();

    setSearch('');
    setCategoryFilter('');
    setPriceFilter('');
  } catch (e) {
    console.error(e);
    alert('Error saving service');
  }
};

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/servicos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error();

      setServices(prev => prev.filter(s => s.id !== id));
    } catch (e) {
      console.error(e);
      alert('Error deleting service');
    }
  };

  /* ================= FILTER ================= */
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesSearch =
        s.nome.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        !categoryFilter || s.id_tiposervico === Number(categoryFilter);
      const matchesPrice =
        !priceFilter || s.priceType === priceFilter;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [services, search, categoryFilter, priceFilter]);

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Services</h1>
          <p className={styles.subtitle}>
            Manage and organize the services your company provides
          </p>
        </div>

        <button
          className={styles.primaryButton}
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Create new service
        </button>
      </div>

      {/* FILTER CARD */}
      <div className={styles.filtersCard}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>

          <input
            className={styles.searchInput}
            placeholder="Search for a specific service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filtersRow}>
          <div className={styles.filterGroup}>
            <label>Category</label>
            <select onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">All categories</option>
              <option value="1">Cleaning</option>
              <option value="2">Maintenance</option>
              <option value="3">Transport</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Price type</label>
            <select onChange={(e) => setPriceFilter(e.target.value)}>
              <option value="">All types</option>
              <option value="hourly">Per hour</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className={styles.servicesGrid}>
        {filteredServices.map(service => (
          <div key={service.id} className={styles.serviceCard}>
            <h3 className={styles.serviceName}>{service.nome}</h3>

            <span
              className={`${styles.categoryBadge} ${getCategoryClass(
                service.id_tiposervico
              )}`}
            >
              {getCategoryName(service.id_tiposervico)}
            </span>

            <p className={styles.description}>{service.descricao}</p>

            <div className={styles.meta}>
              <span className={styles.metaValue}>
                €{service.valor}
                {service.priceType === 'hourly'
                  ? ' / hour'
                  : ' (fixed)'}
              </span>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.secondaryAction}
                onClick={() => {
                  setEditingId(service.id);
                  setFormData({
                    nome: service.nome,
                    descricao: service.descricao,
                    valor: service.valor,
                    id_tiposervico: service.id_tiposervico,
                    priceType: service.priceType
                  });
                  setShowModal(true);
                }}
              >
                Edit
              </button>

              <button
                className={styles.dangerAction}
                onClick={() => handleDelete(service.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              {editingId ? 'Edit service' : 'Create new service'}
            </h2>

            <div className={styles.formGroup}>
              <label>Service name</label>
              <input
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                rows="3"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Category</label>
                <select
                  value={formData.id_tiposervico}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      id_tiposervico: Number(e.target.value)
                    })
                  }
                >
                  <option value={1}>Cleaning</option>
                  <option value={2}>Maintenance</option>
                  <option value={3}>Transport</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Price (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) =>
                  setFormData({ ...formData, valor: e.target.value })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>Price type</label>
              <div className={styles.priceToggle}>
                <button
                  type="button"
                  className={
                    formData.priceType === 'hourly'
                      ? styles.toggleActive
                      : styles.toggleButton
                  }
                  onClick={() =>
                    setFormData({ ...formData, priceType: 'hourly' })
                  }
                >
                  Per hour
                </button>

                <button
                  type="button"
                  className={
                    formData.priceType === 'fixed'
                      ? styles.toggleActive
                      : styles.toggleButton
                  }
                  onClick={() =>
                    setFormData({ ...formData, priceType: 'fixed' })
                  }
                >
                  Fixed price
                </button>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.secondaryAction}
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Cancel
              </button>

              <button
                className={styles.primaryAction}
                onClick={handleSave}
              >
                {editingId ? 'Save changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
