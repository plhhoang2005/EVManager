/**
 * EVManager - AI Chat Concierge Floating Widget (v2.0)
 * Hỗ trợ: Quản lý đa phiên chat, Lưu lịch sử (localStorage), Tạo chat mới, và Gợi ý động theo ngữ cảnh
 */
(function() {
    'use strict';

    if (window.EVManagerAiChatInitialized) return;
    window.EVManagerAiChatInitialized = true;

    const API_BASE = (typeof API_BASE_URL !== 'undefined')
        ? API_BASE_URL
        : ((window.location.protocol.startsWith('http') && window.location.port === '8080')
            ? ''
            : ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                ? 'http://localhost:8080'
                : window.location.origin));
    const CHAT_ENDPOINT = `${API_BASE}/api/v1/ai/chat`;
    const STORAGE_KEY = 'evmanager_ai_chat_sessions_v1';

    let sessions = [];
    let currentSessionId = null;
    let isWaitingResponse = false;

    // Khởi tạo Widget
    function initWidget() {
        loadSessionsFromStorage();

        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'evmanager-ai-chat-root';
        widgetContainer.innerHTML = `
            <!-- Floating Launcher -->
            <button class="ai-chat-launcher" id="aiChatLauncher" aria-label="Mở Trợ lý AI tư vấn sự kiện">
                <div class="ai-chat-launcher-icon">
                    ✦
                    <span class="ai-chat-launcher-badge"></span>
                </div>
                <div class="ai-chat-launcher-text">
                    <span class="ai-chat-launcher-title">Genie AI</span>
                    <span class="ai-chat-launcher-sub">Tư vấn sự kiện 24/7</span>
                </div>
            </button>

            <!-- Chat Window -->
            <div class="ai-chat-window" id="aiChatWindow" role="dialog" aria-modal="true" aria-hidden="true">
                <!-- Header -->
                <div class="ai-chat-header">
                    <div class="ai-chat-header-info">
                        <div class="ai-chat-avatar">✦</div>
                        <div class="ai-chat-header-text">
                            <h4>Genie Concierge <span style="font-size: 11px; background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 10px;">AI</span></h4>
                            <div class="ai-chat-status">
                                <span class="ai-chat-status-dot"></span>
                                Trực tuyến • Sẵn sàng tư vấn
                            </div>
                        </div>
                    </div>
                    <div class="ai-chat-header-actions" style="display: flex; align-items: center; gap: 6px;">
                        <button id="aiNewChatBtn" class="ai-header-btn" title="Đoạn chat mới">➕</button>
                        <button id="aiHistoryBtn" class="ai-header-btn" title="Lịch sử đoạn chat">🕒</button>
                        <button id="aiChatCloseBtn" class="ai-header-btn" title="Đóng chat">✕</button>
                    </div>
                </div>

                <!-- History Drawer -->
                <div class="ai-chat-history-drawer" id="aiHistoryDrawer">
                    <div class="ai-history-header">
                        <strong style="color: #0f172a; font-size: 14px;">Cuộc trò chuyện đã lưu</strong>
                        <button id="aiCloseHistoryBtn" style="background: none; border: none; font-size: 14px; cursor: pointer; color: #64748b;">✕</button>
                    </div>
                    <div class="ai-history-list" id="aiHistoryList"></div>
                </div>

                <!-- Chat Body -->
                <div class="ai-chat-body" id="aiChatBody"></div>

                <!-- Quick Suggestions -->
                <div class="ai-chat-suggestions" id="aiChatSuggestions"></div>

                <!-- Footer / Input Form -->
                <div class="ai-chat-footer">
                    <form class="ai-chat-form" id="aiChatForm">
                        <input type="text" 
                               class="ai-chat-input" 
                               id="aiChatInput" 
                               placeholder="Hỏi Genie về giá tiệc, sảnh, concept..." 
                               autocomplete="off" />
                        <button type="submit" class="ai-chat-send-btn" id="aiChatSendBtn" title="Gửi tin nhắn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(widgetContainer);

        // Bind events
        document.getElementById('aiChatLauncher').addEventListener('click', () => toggleChat(true));
        document.getElementById('aiChatCloseBtn').addEventListener('click', () => toggleChat(false));
        document.getElementById('aiNewChatBtn').addEventListener('click', () => createNewChatSession());
        document.getElementById('aiHistoryBtn').addEventListener('click', toggleHistoryDrawer);
        document.getElementById('aiCloseHistoryBtn').addEventListener('click', toggleHistoryDrawer);

        document.getElementById('aiChatForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('aiChatInput');
            const text = input.value.trim();
            if (!text || isWaitingResponse) return;
            input.value = '';
            sendMessage(text);
        });

        // Nạp phiên chat gần nhất hoặc tạo mới
        if (sessions.length > 0) {
            loadSession(sessions[0].id);
        } else {
            createNewChatSession();
        }

        // Kiểm tra xem Admin có đang Bật tính năng AI hay không (Kill-switch)
        checkAiStatus();
    }

    async function checkAiStatus() {
        try {
            const res = await fetch(`${API_BASE}/api/v1/ai/status`);
            if (res.ok) {
                const data = await res.json();
                if (data.enabled === false) {
                    const launcher = document.getElementById('aiChatLauncher');
                    const chatWin = document.getElementById('aiChatWindow');
                    if (launcher) launcher.style.display = 'none';
                    if (chatWin) chatWin.classList.remove('active');
                }
            }
        } catch (e) {
            // Nếu lỗi mạng, vẫn giữ fallback
        }
    }

    function toggleChat(show) {
        const chatWindow = document.getElementById('aiChatWindow');
        const launcher = document.getElementById('aiChatLauncher');
        const input = document.getElementById('aiChatInput');

        if (show) {
            chatWindow.classList.add('active');
            chatWindow.setAttribute('aria-hidden', 'false');
            launcher.style.display = 'none';
            setTimeout(() => input.focus(), 300);
        } else {
            chatWindow.classList.remove('active');
            chatWindow.setAttribute('aria-hidden', 'true');
            launcher.style.display = 'flex';
        }
    }

    function toggleHistoryDrawer() {
        const drawer = document.getElementById('aiHistoryDrawer');
        if (drawer) {
            drawer.classList.toggle('active');
            if (drawer.classList.contains('active')) {
                renderHistoryList();
            }
        }
    }

    // --- SESSION STORAGE MANAGEMENT ---

    function loadSessionsFromStorage() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            sessions = raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.warn('[Genie AI] Error reading localStorage', e);
            sessions = [];
        }
    }

    function saveSessionsToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
        } catch (e) {
            console.warn('[Genie AI] Error saving localStorage', e);
        }
    }

    function createNewChatSession() {
        const drawer = document.getElementById('aiHistoryDrawer');
        if (drawer) drawer.classList.remove('active');

        const newId = 'session_' + Date.now();
        const newSession = {
            id: newId,
            title: 'Cuộc trò chuyện mới',
            updatedAt: new Date().toISOString(),
            messages: []
        };

        sessions.unshift(newSession);
        if (sessions.length > 15) sessions.pop(); // Giới hạn 15 phiên gần nhất
        currentSessionId = newId;
        saveSessionsToStorage();

        renderChatBodyFromCurrentSession();
        appendBotGreeting();
    }

    function loadSession(sessionId) {
        const found = sessions.find(s => s.id === sessionId);
        if (!found) return;

        currentSessionId = sessionId;
        const drawer = document.getElementById('aiHistoryDrawer');
        if (drawer) drawer.classList.remove('active');

        renderChatBodyFromCurrentSession();
    }

    function deleteSession(sessionId, e) {
        if (e) e.stopPropagation();
        sessions = sessions.filter(s => s.id !== sessionId);
        saveSessionsToStorage();

        if (currentSessionId === sessionId) {
            if (sessions.length > 0) {
                loadSession(sessions[0].id);
            } else {
                createNewChatSession();
            }
        } else {
            renderHistoryList();
        }
    }

    function renderHistoryList() {
        const listEl = document.getElementById('aiHistoryList');
        if (!listEl) return;

        if (sessions.length === 0) {
            listEl.innerHTML = `<div style="text-align: center; color: #94a3b8; padding: 2rem;">Chưa có cuộc trò chuyện nào</div>`;
            return;
        }

        listEl.innerHTML = sessions.map(s => {
            const isActive = s.id === currentSessionId ? 'active' : '';
            return `
                <div class="ai-history-item ${isActive}" onclick="window.EVManagerAiLoadSession('${s.id}')">
                    <div class="ai-history-item-title">${escapeHtml(s.title || 'Đoạn chat')}</div>
                    <button class="ai-history-item-del" title="Xóa đoạn chat này" onclick="window.EVManagerAiDeleteSession('${s.id}', event)">🗑️</button>
                </div>
            `;
        }).join('');
    }

    // Expose helpers cho inline HTML onclick
    window.EVManagerAiLoadSession = loadSession;
    window.EVManagerAiDeleteSession = deleteSession;

    function renderChatBodyFromCurrentSession() {
        const chatBody = document.getElementById('aiChatBody');
        chatBody.innerHTML = '';

        const currentSession = sessions.find(s => s.id === currentSessionId);
        if (!currentSession || currentSession.messages.length === 0) {
            return;
        }

        currentSession.messages.forEach(m => {
            appendMessage(m.role, m.content, false);
        });

        // Set lại gợi ý sau câu cuối cùng
        const lastMsg = currentSession.messages[currentSession.messages.length - 1];
        if (lastMsg && lastMsg.role === 'bot') {
            generateContextualSuggestions(lastMsg.content);
        }
    }

    function appendBotGreeting() {
        const welcomeText = "Dạ chào Quý khách! Em là Genie - Trợ lý AI tư vấn sự kiện của EVManager.\n\n" +
            "Em có thể hỗ trợ Quý khách giải đáp mọi thông tin về:\n" +
            "• Gói tiệc cưới trọn gói & concept trang trí\n" +
            "• Chi phí tổ chức hội nghị doanh nghiệp & Gala\n" +
            "• Phân bổ ngân sách & chọn thực đơn ẩm thực\n\n" +
            "Quý khách đang chuẩn bị sự kiện gì ạ?";

        appendMessage('bot', welcomeText, true);
        setSuggestions([
            "Tư vấn gói tiệc cưới trọn gói",
            "Báo giá hội nghị doanh nghiệp",
            "Dự toán ngân sách tự động",
            "Liên hệ hotline tư vấn"
        ]);
    }

    function appendMessage(role, text, save = true) {
        const chatBody = document.getElementById('aiChatBody');
        const msgEl = document.createElement('div');
        msgEl.className = `ai-msg ${role}`;

        const bubbleEl = document.createElement('div');
        bubbleEl.className = 'ai-msg-bubble';
        bubbleEl.textContent = text;

        const timeEl = document.createElement('div');
        timeEl.className = 'ai-msg-time';
        const now = new Date();
        timeEl.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        msgEl.appendChild(bubbleEl);
        msgEl.appendChild(timeEl);
        chatBody.appendChild(msgEl);
        chatBody.scrollTop = chatBody.scrollHeight;

        if (save) {
            const currentSession = sessions.find(s => s.id === currentSessionId);
            if (currentSession) {
                currentSession.messages.push({ role, content: text });
                currentSession.updatedAt = new Date().toISOString();

                // Cập nhật title session theo câu hỏi đầu tiên của user
                if (role === 'user' && currentSession.title === 'Cuộc trò chuyện mới') {
                    currentSession.title = text.length > 32 ? text.substring(0, 30) + '...' : text;
                }
                saveSessionsToStorage();
            }
        }
    }

    function showTypingIndicator() {
        const chatBody = document.getElementById('aiChatBody');
        const indicator = document.createElement('div');
        indicator.id = 'aiTypingIndicator';
        indicator.className = 'ai-typing-indicator';
        indicator.innerHTML = `
            <span class="ai-typing-dot"></span>
            <span class="ai-typing-dot"></span>
            <span class="ai-typing-dot"></span>
        `;
        chatBody.appendChild(indicator);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('aiTypingIndicator');
        if (indicator) indicator.remove();
    }

    function setSuggestions(suggestions) {
        const container = document.getElementById('aiChatSuggestions');
        container.innerHTML = '';
        if (!suggestions || suggestions.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'flex';
        suggestions.forEach(s => {
            const chip = document.createElement('button');
            chip.className = 'ai-suggestion-chip';
            chip.type = 'button';
            chip.textContent = s;
            chip.addEventListener('click', () => {
                if (isWaitingResponse) return;
                sendMessage(s);
            });
            container.appendChild(chip);
        });
    }

    // Tự động sinh gợi ý động dựa theo nội dung
    function generateContextualSuggestions(contextText) {
        const t = (contextText || '').toLowerCase();
        if (t.includes('cưới') || t.includes('wedding')) {
            setSuggestions([
                "Xem thực đơn 6 món tiệc cưới",
                "Sảnh Kim Cương có còn trống?",
                "Ước tính chi phí 150 khách",
                "Chính sách ưu đãi mùa cưới"
            ]);
        } else if (t.includes('hội nghị') || t.includes('gala') || t.includes('doanh nghiệp')) {
            setSuggestions([
                "Báo giá Teabreak hội thảo",
                "Gói màn hình LED & Âm thanh",
                "Kịch bản Gala Year End Party",
                "Xuất hóa đơn VAT doanh nghiệp"
            ]);
        } else if (t.includes('ngân sách') || t.includes('giá') || t.includes('triệu')) {
            setSuggestions([
                "Mở máy tính dự toán ngân sách",
                "Cách tiết kiệm 15% chi phí",
                "Gặp tư vấn viên chốt sảnh"
            ]);
        } else {
            setSuggestions([
                "Tư vấn gói tiệc cưới trọn gói",
                "Dự toán chi phí sự kiện",
                "Xem danh sách sảnh tiệc"
            ]);
        }
    }

    async function sendMessage(userText) {
        isWaitingResponse = true;
        const sendBtn = document.getElementById('aiChatSendBtn');
        const input = document.getElementById('aiChatInput');
        sendBtn.disabled = true;
        input.disabled = true;

        // Hiển thị tin nhắn user
        appendMessage('user', userText, true);
        setSuggestions([]);
        showTypingIndicator();

        const currentSession = sessions.find(s => s.id === currentSessionId);
        const historyPayload = currentSession ? currentSession.messages.slice(-8) : [];

        try {
            const response = await fetch(CHAT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: userText,
                    history: historyPayload
                })
            });

            removeTypingIndicator();

            if (!response.ok) {
                throw new Error(`Server status ${response.status}`);
            }

            const data = await response.json();
            const reply = data.reply || "Dạ Quý khách cần em tư vấn thêm chi tiết gì không ạ?";
            
            appendMessage('bot', reply, true);

            if (data.quickSuggestions && data.quickSuggestions.length > 0) {
                setSuggestions(data.quickSuggestions);
            } else {
                generateContextualSuggestions(reply);
            }

        } catch (error) {
            console.warn('[Genie AI] Fetch failed, fallback active:', error);
            removeTypingIndicator();

            const fallback = getClientFallbackReply(userText);
            appendMessage('bot', fallback.reply, true);
            setSuggestions(fallback.suggestions);
        } finally {
            isWaitingResponse = false;
            sendBtn.disabled = false;
            input.disabled = false;
            input.focus();
        }
    }

    function getClientFallbackReply(userText) {
        const text = (userText || '').toLowerCase();
        if (text.includes('cưới') || text.includes('wedding')) {
            return {
                reply: "Dạ chào Quý khách! EVManager có các gói tiệc cưới trọn gói sang trọng:\n\n• Gói Silver (35 - 60 triệu): Sảnh tiệc hiện đại, thực đơn 6 món chuẩn vị, âm thanh ánh sáng cơ bản.\n• Gói Gold (60 - 120 triệu): Hoa tươi cao cấp, màn hình LED P3, MC và vũ đoàn khai tiệc.\n• Gói Diamond VIP (> 120 triệu): Thiết kế concept riêng biệt, chụp hình đón khách & video 4K highlight.\n\nQuý khách dự kiến đãi tiệc bao nhiêu khách mời ạ?",
                suggestions: ["Dự toán chi phí 150 khách", "Xem thực đơn tiệc cưới", "Đặt lịch tham quan sảnh"]
            };
        } else if (text.includes('hội nghị') || text.includes('doanh nghiệp') || text.includes('gala') || text.includes('corporate')) {
            return {
                reply: "Chào Quý khách! EVManager chuyên tổ chức hội nghị và sự kiện doanh nghiệp chuẩn quốc tế:\n\n• Hội nghị khách hàng & Hội thảo: Âm thanh micro chuyên dụng, màn hình LED, cabin dịch thuật.\n• Tiệc Year-End Party & Gala: Kịch bản sân khấu sôi động, teambuilding, minigame công nghệ.\n• Lễ ra mắt sản phẩm: Backdrop 3D, hiệu ứng ánh sáng laser hiện đại.\n\nQuý công ty có thể cho chúng tôi biết quy mô dự kiến không ạ?",
                suggestions: ["Báo giá teabreak hội nghị", "Thuê màn hình LED & Âm thanh", "Kế hoạch tổ chức Gala"]
            };
        } else {
            return {
                reply: "Dạ chào Quý khách! Em là Genie - Trợ lý AI tư vấn sự kiện của EVManager.\n\nEm có thể hỗ trợ Quý khách:\n1. Dự toán chi phí & phân bổ ngân sách sự kiện.\n2. Tư vấn sảnh tiệc, thực đơn ẩm thực và phong cách trang trí.\n3. Lập checklist chuẩn bị và kịch bản timeline sự kiện.\n\nQuý khách đang quan tâm đến loại hình sự kiện nào?",
                suggestions: ["Tư vấn gói tiệc cưới trọn gói", "Báo giá hội nghị doanh nghiệp", "Dự toán ngân sách tự động"]
            };
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }
})();
