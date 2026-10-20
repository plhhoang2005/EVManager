#!/usr/bin/env bash
# ==============================================================================
# EVManager - Database Backup Script (PostgreSQL)
# Deliverable for Issue BE-33 (#130) - Hardened Version
# ==============================================================================

set -eo pipefail

# 1. Xác định thư mục gốc dự án
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
BACKUP_DIR="${BACKEND_DIR}/backups"

# 2. Đọc biến môi trường từ .env nếu tồn tại
if [ -f "${BACKEND_DIR}/.env" ]; then
    echo "==> Đang nạp cấu hình từ ${BACKEND_DIR}/.env..."
    # Export các biến nhưng bỏ qua dòng comment
    export $(grep -v '^#' "${BACKEND_DIR}/.env" | xargs)
fi

# 3. Thiết lập thông số mặc định nếu chưa có
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-evmanager}"
DB_USERNAME="${DB_USERNAME:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"

# 4. Tạo thư mục chứa backup nếu chưa có
mkdir -p "${BACKUP_DIR}"

# 5. Đặt tên file có timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/evmanager_backup_${TIMESTAMP}.sql.gz"

echo "=================================================="
echo "  EVManager - Bắt đầu sao lưu cơ sở dữ liệu"
echo "  Database: ${DB_NAME}@${DB_HOST}:${DB_PORT}"
echo "  File đích: ${BACKUP_FILE}"
echo "=================================================="

# 6. Thực hiện pg_dump và nén gzip
export PGPASSWORD="${DB_PASSWORD}"

# Đảm bảo dọn dẹp PGPASSWORD khi thoát
trap 'unset PGPASSWORD' EXIT

if pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USERNAME}" -d "${DB_NAME}" --clean --if-exists --no-owner --no-privileges | gzip > "${BACKUP_FILE}"; then
    # Kiểm tra kích thước file sao lưu (bắt buộc >= 1024 bytes)
    FILE_SIZE_BYTES=0
    if [ -f "${BACKUP_FILE}" ]; then
        FILE_SIZE_BYTES=$(wc -c < "${BACKUP_FILE}" 2>/dev/null || stat -c %s "${BACKUP_FILE}" 2>/dev/null || echo 0)
    fi

    if [ "${FILE_SIZE_BYTES}" -lt 1024 ]; then
        echo "==> [CẢNH BÁO LỖI] File sao lưu sinh ra không hợp lệ hoặc quá nhỏ (< 1KB: ${FILE_SIZE_BYTES} bytes)."
        echo "==> Đang xóa file sao lưu bị lỗi: ${BACKUP_FILE}"
        rm -f "${BACKUP_FILE}"
        unset PGPASSWORD
        exit 1
    fi

    FILE_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    echo "==> [THÀNH CÔNG] Sao lưu hoàn tất!"
    echo "==> Kích thước file: ${FILE_SIZE} (${FILE_SIZE_BYTES} bytes)"
    echo "==> Đường dẫn: ${BACKUP_FILE}"
else
    echo "==> [LỖI] Sao lưu thất bại. Vui lòng kiểm tra kết nối PostgreSQL."
    rm -f "${BACKUP_FILE}"
    unset PGPASSWORD
    exit 1
fi

unset PGPASSWORD

# 7. Xoay vòng bản sao lưu: Tự động xóa các file cũ hơn 7 ngày
echo "==> Đang kiểm tra và dọn dẹp các bản backup cũ hơn 7 ngày..."
find "${BACKUP_DIR}" -name "evmanager_backup_*.sql.gz" -mtime +7 -delete || true

echo "==> Hoàn tất quy trình sao lưu."
