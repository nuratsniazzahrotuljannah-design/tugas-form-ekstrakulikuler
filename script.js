
        /* 1. System Prompt & Knowledge Base for Gemini AI */
        const GEMINI_SYSTEM_PROMPT = `
Anda adalah Asisten Konsultan Ekstrakurikuler SMK (Sekolah Menengah Kejuruan) yang ramah, informatif, dan sangat paham kebutuhan siswa SMK.
Tugas Anda adalah membantu siswa memilih dari 14 EKSTRAKURIKULER Sekolah berikut:

1. JURNALISTIK: Belajar jurnalisme, fotografi, videografi, majalah dinding/digital, penulisan berita. Cocok untuk DKV, RPL, PPLG, Perkantoran. Benefit: Portfolio konten, sertifikat media.
2. PMR (Palang Merah Remaja): Pertolongan pertama, kesehatan umum, donor darah, kemanusiaan. Cocok untuk siswa kesehatan/umum. Benefit: Sertifikat Kemanusiaan, Soft Skill Medis.
3. PASKIBRA: Baris-berbaris, kedisiplinan, pengibaran bendera, ketahanan fisik. Benefit: Peluang Pasukan Kota/Nasional, Karakter Disiplin.
4. PENCAK SILAT: Seni bela diri tradisional, prestasi kejuaraan, ketangkasan fisik. Benefit: Sertifikat Kejuaraan untuk Beasiswa/Kerja.
5. NARI / SENI TARI: Tari tradisional & kreasi modern, penampilan panggung acara sekolah. Benefit: Pelestarian budaya, Kepercayaan diri panggung.
6. BAHASA JEPANG (Nihongo Club): Percakapan Jepang, kanji dasar, budaya (anime/cosplay), persiapan magang/kerja ke Jepang (program Internship SMK). Benefit: Modal kerja/kuliah ke Jepang.
7. BANTARA / PRAMUKA: Kepramukaan penegak, kepemimpinan, survival, kemah. Benefit: Wajib/Sertifikat Bantara untuk Beasiswa.
8. FUTSAL: Olahraga bola indoor, kerja sama tim, turnamen antar sekolah. Benefit: Ketahanan fisik, prestasi olahraga.
9. VOLLY: Olahraga bola voli, teknik passing/smash, turnamen. Benefit: Kesehatan fisik & kekompakan.
10. DRUMBAND: Musik korps tiup & tiup perkusi, tampil di upacara dan pawai. Benefit: Musikalitas & Kekompakan parade.
11. ROBBANA / HADROH: Seni musik islami, lantunan shalawat, tampil di perayaan keagamaan. Benefit: Spiritual & Ketrampilan bermusik.
12. ROHIS (Kerohanian Islam): Kajian keislaman, kebersamaan, kepemimpinan religi, kegiatan bakti sosial. Benefit: Pembentukan akhlak & Relasi positif.
13. FASTER (Automotive / English / Tech Club): Pengembangan ketrampilan teknik cepat, kosa kata bahasa Inggris teknik, dan inovasi SMK. Cocok untuk Teknik Otomotif/Mesin/RPL. Benefit: Sertifikat kompetensi pendamping.
14. PADUS (Paduan Suara): Seni olah vokal kelompok, tampil resmi di upacara dan perlombaan. Benefit: Olah vokal & Sertifikat Padus.

Petunjuk Jawaban AI:
- Jawablah secara singkat, ramah, dan terstruktur (gunakan penomoran atau poin tebal jika relevan).
- Jika siswa menyebutkan jurusannya (misal PPLG/RPL, DKV, TKR, AKL), berikan saran 2-3 ekskul yang paling menunjang karier/portofolio jurusan tersebut.
- Gunakan bahasa Indonesia santun yang akrab bagi anak SMK.
`;

        let selectedFileName = '';
        let isChatDrawerOpen = false;

        /* 2. File Input & Form Handling */
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
            const mainEkskul = document.getElementById('mainEkskul').value;
            const secondaryEkskul = document.getElementById('secondaryEkskul').value || '-';
            const motivation = document.getElementById('studentMotivation').value;

            const regData = {
                id: 'REG-' + Math.floor(100000 + Math.random() * 900000),
                date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                name, nis, gender, studentClass, major, phone, mainEkskul, secondaryEkskul, motivation,
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

        /*   3. Toast & History Modal Helpers*/
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

        /* ----------------------------------------------------
           4. AI Chatbot Drawer & Gemini API Integration
        ---------------------------------------------------- */
        function toggleChatDrawer() {
            const drawer = document.getElementById('chatDrawer');
            isChatDrawerOpen = !isChatDrawerOpen;
            
            if (isChatDrawerOpen) {
                drawer.classList.remove('translate-y-[120%]');
            } else {
                drawer.classList.add('translate-y-[120%]');
            }
        }

        function askAiRecommendation() {
            const major = document.getElementById('studentMajor').value;
            if (!isChatDrawerOpen) toggleChatDrawer();

            if (major) {
                sendQuickPrompt(`Rekomendasikan ekskul terbaik untuk siswa jurusan ${major}`);
            } else {
                sendQuickPrompt("Apa saja ekskul populer untuk anak SMK dan manfaatnya?");
            }
        }

        function sendQuickPrompt(promptText) {
            if (!isChatDrawerOpen) toggleChatDrawer();
            document.getElementById('chatInput').value = promptText;
            handleChatSubmit(new Event('submit'));
        }

        async function handleChatSubmit(e) {
            e.preventDefault();
            const inputEl = document.getElementById('chatInput');
            const query = inputEl.value.trim();

            if (!query) return;

            // Render User Message
            appendChatMessage('user', query);
            inputEl.value = '';

            // Show Typing Indicator
            const typingEl = document.getElementById('chatTyping');
            typingEl.classList.remove('hidden');
            scrollChatToBottom();

            try {
                // API Call to Gemini
                const apiKey = ""; // API key populated dynamically at runtime
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

                const payload = {
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: query }]
                        }
                    ],
                    systemInstruction: {
                        parts: [{ text: GEMINI_SYSTEM_PROMPT }]
                    }
                };

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                const aiResponseText = result.candidates?.[0]?.content?.parts?.[0]?.text;

                typingEl.classList.add('hidden');

                if (aiResponseText) {
                    appendChatMessage('ai', aiResponseText);
                } else {
                    appendChatMessage('ai', 'Maaf, saya belum dapat memproses pertanyaan tersebut. Silakan coba pertanyaan lainnya!');
                }

            } catch (error) {
                console.error('Gemini API Error:', error);
                typingEl.classList.add('hidden');
                appendChatMessage('ai', 'Maaf, koneksi ke asisten AI sedang bermasalah. Anda tetap dapat mendaftar langsung melalui formulir di samping.');
            }

            scrollChatToBottom();
        }

        function appendChatMessage(sender, text) {
            const chatMessages = document.getElementById('chatMessages');
            const msgDiv = document.createElement('div');

            if (sender === 'user') {
                msgDiv.className = 'flex items-start justify-end gap-2.5';
                msgDiv.innerHTML = `
                    <div class="bg-brand-600 text-white p-3 rounded-2xl rounded-tr-xs text-xs shadow-sm leading-relaxed max-w-[85%] font-medium">
                        ${escapeHtml(text)}
                    </div>
                `;
            } else {
                msgDiv.className = 'flex items-start gap-2.5';
                msgDiv.innerHTML = `
                    <div class="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                        <i class="fa-solid fa-robot"></i>
                    </div>
                    <div class="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-xs text-xs text-slate-700 shadow-sm leading-relaxed max-w-[85%]">
                        ${formatMarkdownText(text)}
                    </div>
                `;
            }

            chatMessages.appendChild(msgDiv);
        }

        function scrollChatToBottom() {
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function escapeHtml(text) {
            return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }

        // Basic Markdown Formatter for AI responses (Bold, Bullets, Linebreaks)
        function formatMarkdownText(text) {
            let formatted = escapeHtml(text);
            formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
            formatted = formatted.replace(/\*(.*?)\*/g, '<i>$1</i>');
            formatted = formatted.replace(/\n\n/g, '<br><br>');
            formatted = formatted.replace(/\n/g, '<br>');
            return formatted;
        }
   