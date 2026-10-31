/**
 * EVManager - AI Chat Concierge Floating Widget
 * Integrates with POST /api/v1/ai/chat (Google Gemini 1.5 Flash backend)
 */
(function() {
    'use strict';

    // Avoid duplicate initialization
    if (window.EVManagerAiChatInitialized) return;
    window.EVManagerAiChatInitialized = true;

    const API_BASE = (window.location.protocol.startsWith('http') && window.location.port === '8080')
        ? ''
        : 'http://localhost:8080';
    const CHAT_ENDPOINT = `${API_BASE}/api/v1/ai/chat`;

    let chatHistory = [];
    let isWaitingResponse = false;

    // Build and inject HTML structure
    function initWidget() {
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
                    <div class="ai-chat-header-actions">
                        <button id="aiChatCloseBtn" title="Đóng chat">✕</button>
                    </div>
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
        const launcher = document.getElementById('aiChatLauncher');
        const chatWindow = document.getElementById('aiChatWindow');
        const closeBtn = document.getElementById('aiChatCloseBtn');
        const form = document.getElementById('aiChatForm');
        const input = document.getElementById('aiChatInput');

        launcher.addEventListener('click', () => toggleChat(true));
        closeBtn.addEventListener('click', () => toggleChat(false));

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text || isWaitingResponse) return;
            input.value = '';
            sendMessage(text);
        });

        // Seed welcome greeting
        appendBotGreeting();
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

    function appendBotGreeting() {
        const welcomeText = "Dạ chào Quý khách! Em là Genie - Trợ lý AI tư vấn sự kiện của EVManager.\n\n" +
            "Em có thể hỗ trợ Quý khách giải đáp mọi thông tin về:\n" +
            "• Gói tiệc cưới trọn gói & concept trang trí\n" +
            "• Chi phí tổ chức hội nghị doanh nghiệp & Gala\n" +
            "• Phân bổ ngân sách & chọn thực đơn ẩm thực\n\n" +
            "Quý khách đang chuẩn bị sự kiện gì ạ?";

        appendMessage('bot', welcomeText);
        setSuggestions([
            "Tư vấn gói tiệc cưới trọn gói",
            "Báo giá hội nghị doanh nghiệp",
            "Dự toán ngân sách tự động",
            "Liên hệ hotline tư vấn"
        ]);
    }

    function appendMessage(role, text) {
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

    async function sendMessage(userText) {
        isWaitingResponse = true;
        const sendBtn = document.getElementById('aiChatSendBtn');
        const input = document.getElementById('aiChatInput');
        sendBtn.disabled = true;
        input.disabled = true;

        // Display user message
        appendMessage('user', userText);
        setSuggestions([]); // hide while waiting
        showTypingIndicator();

        // Update history memory
        chatHistory.push({ role: 'user', content: userText });

        try {
            const response = await fetch(CHAT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: userText,
                    history: chatHistory.slice(-8) // send recent turns
                })
            });

            removeTypingIndicator();

            if (!response.ok) {
                throw new Error(`Server returned status ${response.status}`);
            }

            const data = await response.json();
            const reply = data.reply || "Xin lỗi Quý khách, em chưa nghe rõ. Quý khách vui lòng thử lại nhé ạ!";
            
            appendMessage('bot', reply);
            chatHistory.push({ role: 'model', content: reply });

            if (data.quickSuggestions && data.quickSuggestions.length > 0) {
                setSuggestions(data.quickSuggestions);
            } else {
                setSuggestions([
                    "Xem thêm dịch vụ",
                    "Dự toán chi phí AI",
                    "Liên hệ tư vấn viên"
                ]);
            }

        } catch (error) {
            console.warn('[Genie AI] Fetch error, using client fallback:', error);
            removeTypingIndicator();

            const fallback = getClientFallbackReply(userText);
            appendMessage('bot', fallback.reply);
            chatHistory.push({ role: 'model', content: fallback.reply });
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
        } else if (text.includes('sinh nhật') || text.includes('thôi nôi')) {
            return {
                reply: "Chào bạn! EVManager có các gói tiệc sinh nhật & thôi nôi ấm cúng, lung linh:\n\n• Backdrop bong bóng nghệ thuật theo chủ đề riêng.\n• Chú hề tạo hình bong bóng, MC hoạt náo và biểu diễn ảo thuật.\n• Thực đơn tiệc phong phú cho cả người lớn và trẻ nhỏ.\n\nBạn muốn tổ chức sinh nhật cho bé hay người lớn ạ?",
                suggestions: ["Gói trang trí thôi nôi cho bé", "Thực đơn tiệc sinh nhật", "Đặt chỗ cuối tuần"]
            };
        } else {
            return {
                reply: "Dạ chào Quý khách! Em là Genie - Trợ lý AI tư vấn sự kiện của EVManager.\n\nEm có thể hỗ trợ Quý khách:\n1. Dự toán chi phí & phân bổ ngân sách sự kiện.\n2. Tư vấn sảnh tiệc, thực đơn ẩm thực và phong cách trang trí.\n3. Lập checklist chuẩn bị và kịch bản timeline sự kiện.\n\nQuý khách đang quan tâm đến loại hình sự kiện nào (tiệc cưới, hội nghị, sinh nhật)?",
                suggestions: ["Tư vấn gói tiệc cưới trọn gói", "Báo giá hội nghị doanh nghiệp", "Dự toán ngân sách tự động", "Hotline: 1900-8888"]
            };
        }
    }

    // Auto mount when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }
})();
