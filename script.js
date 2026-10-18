let selectedFileName = '';
/* ----------------------------------------------------
           2. File Input & Form Handling
        ---------------------------------------------------- */
        function handleFileSelect(e) {
            const file = e.target.files[0];
            const nameDisplay = document.getElementById('fileNameText');
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    showToast('Ukuran file melebihi 2MB!', 'Error', true);
                    e.target.value = '';
                    nameDisplay.innerText = 'Format yang didukung: PDF, JPG, PNG';
                    nameDisplay.classList.remove('text-brand-600', 'font-bold');
                    selectedFileName = '';
                    return;
                }
                selectedFileName = file.name;
                nameDisplay.innerText = `Terpilih: ${file.name}`;
                nameDisplay.classList.add('text-brand-600', 'font-bold');
            }
        }

        function validateEkskulSelection() {
            const main = document.getElementById('mainEkskul').value;
            const secondary = document.getElementById('secondaryEkskul').value;

            if (main && secondary && main === secondary) {
                showToast('Pilihan cadangan tidak boleh sama dengan pilihan utama!', 'Peringatan', true);
                document.getElementById('secondaryEkskul').value = '';
            }
        }

        function handleFormSubmit(e) {
            e.preventDefault();

            const name = document.getElementById('studentName').value;
            const nis = document.getElementById('studentNis').value;
            const gender = document.getElementById('studentGender').value;
            const studentClass = document.getElementById('studentClass').value;
            const major = document.getElementById('studentMajor').value;
            const phone = document.getElementById('studentPhone').value;
            const email = document.getElementById('studentEmail').value;
            const password = document.getElementById('studentPassword').value;

            if (password.length < 8) {
                showToast('Password harus minimal 8 karakter!', 'Peringatan', true);
                document.getElementById('studentPassword').focus();
                return;
            }
            const mainEkskul = document.getElementById('mainEkskul').value;
            const secondaryEkskul = document.getElementById('secondaryEkskul').value || '-';
            const motivation = document.getElementById('studentMotivation').value;

            const regData = {
                id: 'REG-' + Math.floor(100000 + Math.random() * 900000),
                date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                name, nis, gender, studentClass, major, phone, email, password, mainEkskul, secondaryEkskul, motivation,
                fileName: selectedFileName || 'Tidak ada berkas uploaded'
            };

            // Save to LocalStorage
            const existing = JSON.parse(localStorage.getItem('smkEkskulRegistrations') || '[]');
            existing.push(regData);
            localStorage.setItem('smkEkskulRegistrations', JSON.stringify(existing));

            displaySummary(regData);
            showToast('Pendaftaran berhasil dikirim!', 'Sukses');
            resetForm();
        }

        function displaySummary(data) {
            const summaryContent = document.getElementById('summaryContent');
            summaryContent.innerHTML = `
                <div class="bg-brand-50 p-3 rounded-2xl border border-brand-100 flex justify-between items-center mb-2">
                    <span class="text-[10px] text-brand-700 font-bold uppercase">No. Registrasi</span>
                    <span class="font-extrabold text-brand-900 font-mono text-sm">${data.id}</span>
                </div>
                <div class="space-y-2 text-slate-600">
                    <div class="flex justify-between border-b border-slate-100 pb-1">
                        <span class="text-slate-400">Nama Siswa:</span>
                        <span class="font-bold text-slate-800">${data.name}</span>
                    </div>
                    <div class="flex justify-between border-b border-slate-100 pb-1">
                        <span class="text-slate-400">NISN:</span>
                        <span class="font-bold text-slate-800">${data.nis}</span>
                    </div>
                    <div class="flex justify-between border-b border-slate-100 pb-1">
                        <span class="text-slate-400">Email:</span>
                        <span class="font-bold text-slate-800">${data.email}</span>
                    </div>
                    <div class="flex justify-between border-b border-slate-100 pb-1">
                        <span class="text-slate-400">Kelas & Jurusan:</span>
                        <span class="font-bold text-slate-800">${data.studentClass} • ${data.major}</span>
                    </div>
                    <div class="flex justify-between border-b border-slate-100 pb-1">
                        <span class="text-slate-400">Ekskul Utama:</span>
                        <span class="font-extrabold text-brand-600">${data.mainEkskul}</span>
                    </div>
                    <div class="flex justify-between border-b border-slate-100 pb-1">
                        <span class="text-slate-400">Ekskul Cadangan:</span>
                        <span class="font-bold text-slate-700">${data.secondaryEkskul}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400">Tanggal Daftar:</span>
                        <span class="font-medium text-slate-600">${data.date}</span>
                    </div>
                </div>
            `;
            document.getElementById('summaryModal').classList.remove('hidden');
        }

        function closeSummaryModal() {
            document.getElementById('summaryModal').classList.add('hidden');
        }

        function resetForm() {
            document.getElementById('ekskulForm').reset();
            document.getElementById('fileNameText').innerText = 'Format yang didukung: PDF, JPG, PNG';
            document.getElementById('fileNameText').classList.remove('text-brand-600', 'font-bold');
            selectedFileName = '';
        }

        /* ----------------------------------------------------
           3. Toast & History Modal Helpers
        ---------------------------------------------------- */
        function showToast(msg, title = 'Notifikasi', isError = false) {
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toastMessage');
            const toastTitle = document.getElementById('toastTitle');
            const toastIcon = document.getElementById('toastIcon');

            toastMsg.innerText = msg;
            toastTitle.innerText = title;

            if (isError) {
                toastIcon.className = "fa-solid fa-circle-exclamation text-rose-400 text-lg";
            } else {
                toastIcon.className = "fa-solid fa-circle-check text-emerald-400 text-lg";
            }

            toast.classList.remove('translate-y-[-120%]', 'opacity-0', 'pointer-events-none');
            setTimeout(() => {
                toast.classList.add('translate-y-[-120%]', 'opacity-0', 'pointer-events-none');
            }, 3200);
        }

        function openHistoryModal() {
            const list = document.getElementById('historyList');
            const history = JSON.parse(localStorage.getItem('smkEkskulRegistrations') || '[]');

            if (history.length === 0) {
                list.innerHTML = `<p class="text-xs text-slate-400 text-center py-6">Belum ada data pendaftaran tersimpan.</p>`;
            } else {
                list.innerHTML = history.map(item => `
                    <div class="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex justify-between items-center text-xs">
                        <div>
                            <span class="font-extrabold text-brand-700 block">${item.mainEkskul}</span>
                            <p class="font-bold text-slate-800 text-[11px]">${item.name} (${item.studentClass})</p>
                            <span class="text-[10px] text-slate-400">${item.date} • ${item.id}</span>
                        </div>
                        <span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Terdaftar</span>
                    </div>
                `).join('');
            }
            document.getElementById('historyModal').classList.remove('hidden');
        }

        function closeHistoryModal() {
            document.getElementById('historyModal').classList.add('hidden');
        }

        function clearHistory() {
            if (confirm('Apakah kamu yakin ingin menghapus semua riwayat pendaftaran?')) {
                localStorage.removeItem('smkEkskulRegistrations');
                openHistoryModal();
                showToast('Riwayat berhasil dihapus.', 'Terhapus');
            }
        }
