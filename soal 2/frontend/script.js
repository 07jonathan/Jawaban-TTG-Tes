const API_URL = "http://localhost:3000/api";
let isEditMode = false;
let currentEditId = null;

const form = document.getElementById("user-form");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");
const loadingElement = document.getElementById("loading");
const usersTable = document.getElementById("users-table");
const usersTableBody = document.getElementById("users-table-body");
const emptyMessage = document.getElementById("empty-message");
const serverStatusIndicator = document.getElementById("server-status");
const serverStatusText = document.getElementById("server-status-text");

document.addEventListener("DOMContentLoaded", () => {
  checkServerHealth();
  loadUsers();

  form.addEventListener("submit", handleFormSubmit);
  cancelBtn.addEventListener("click", cancelEdit);
});

// Cek sambungan server
async function checkServerHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();

    if (data.database === "connected") {
      serverStatusIndicator.className = "status-indicator status-connected";
      serverStatusText.textContent = "Terhubung";
    } else {
      serverStatusIndicator.className = "status-indicator status-disconnected";
      serverStatusText.textContent = "Terputus";
    }
  } catch (error) {
    console.error("Error checking server health:", error);
    serverStatusIndicator.className = "status-indicator status-disconnected";
    serverStatusText.textContent = "Error";
  }
}

// Fungsi untuk memuat data pengguna
async function loadUsers() {
  try {
    showLoading();

    const response = await fetch(`${API_URL}/users`);
    const result = await response.json();

    if (result.success) {
      renderUsers(result.data);
    } else {
      showError("Gagal memuat data pengguna");
    }
  } catch (error) {
    console.error("Error loading users:", error);
    showError("Koneksi ke server gagal");
  }
}

// Merender data pengguna ke tabel
function renderUsers(users) {
  hideLoading();

  if (users.length === 0) {
    usersTable.style.display = "none";
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";
  usersTable.style.display = "table";

  usersTableBody.innerHTML = "";

  users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.style.animation = `fadeIn 0.3s ease-out ${index * 0.05}s both`;
    row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone || "-"}</td>
                    <td>${new Date(user.created_at).toLocaleString(
                      "id-ID"
                    )}</td>
                    <td>
                        <div class="actions">
                            <button class="action-btn btn-success" onclick="editUser(${
                              user.id
                            })">Edit</button>
                            <button class="action-btn btn-danger" onclick="deleteUser(${
                              user.id
                            })">Hapus</button>
                        </div>
                    </td>
                `;
    usersTableBody.appendChild(row);
  });
}

// Submit form
async function handleFormSubmit(event) {
  event.preventDefault();

  const userData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
  };

  if (!userData.name || !userData.email) {
    showError("Nama dan email wajib diisi");
    return;
  }

  if (isEditMode) {
    await updateUser(currentEditId, userData);
  } else {
    await createUser(userData);
  }
}

// Membuat pengguna baru
async function createUser(userData) {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (result.success) {
      showSuccess("Pengguna berhasil ditambahkan");
      resetForm();
      loadUsers();
    } else {
      showError(result.message || "Gagal menambahkan pengguna");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    showError("Gagal menambahkan pengguna");
  }
}

// Edit pengguna
async function editUser(userId) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`);
    const result = await response.json();

    if (result.success) {
      const user = result.data;
      document.getElementById("user-id").value = user.id;
      document.getElementById("name").value = user.name;
      document.getElementById("email").value = user.email;
      document.getElementById("phone").value = user.phone || "";

      isEditMode = true;
      currentEditId = userId;

      formTitle.textContent = "Edit Pengguna";
      submitBtn.textContent = "Update Pengguna";
      cancelBtn.style.display = "block";

      document
        .querySelector(".form-section")
        .scrollIntoView({ behavior: "smooth" });
    } else {
      showError("Gagal memuat data pengguna");
    }
  } catch (error) {
    console.error("Error loading user for edit:", error);
    showError("Gagal memuat data pengguna");
  }
}

// Update pengguna
async function updateUser(userId, userData) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (result.success) {
      showSuccess("Pengguna berhasil diperbarui");
      resetForm();
      loadUsers();
    } else {
      showError(result.message || "Gagal memperbarui pengguna");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    showError("Gagal memperbarui pengguna");
  }
}

// Hapus pengguna
async function deleteUser(userId) {
  if (!confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.success) {
      showSuccess("Pengguna berhasil dihapus");
      loadUsers();
    } else {
      showError(result.message || "Gagal menghapus pengguna");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    showError("Gagal menghapus pengguna");
  }
}

// Reset form
function resetForm() {
  form.reset();
  document.getElementById("user-id").value = "";
  isEditMode = false;
  currentEditId = null;

  formTitle.textContent = "Tambah Pengguna Baru";
  submitBtn.textContent = "Tambah Pengguna";
  cancelBtn.style.display = "none";
}

// Batalkan edit
function cancelEdit() {
  resetForm();
}

// Refresh data
function refreshData() {
  checkServerHealth();
  loadUsers();
}

// Pesan error
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  successMessage.style.display = "none";

  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 5000);
}

// Pesan sukses
function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.style.display = "block";
  errorMessage.style.display = "none";

  setTimeout(() => {
    successMessage.style.display = "none";
  }, 3000);
}

// Menampilkan loading
function showLoading() {
  loadingElement.style.display = "block";
  usersTable.style.display = "none";
  emptyMessage.style.display = "none";
}

// Menyembunyikan loading
function hideLoading() {
  loadingElement.style.display = "none";
}
