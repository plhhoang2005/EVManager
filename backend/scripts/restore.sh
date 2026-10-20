#!/usr/bin/env bash
# ==============================================================================
# EVManager - Database Restore Script (PostgreSQL)
# Deliverable for Issue BE-33 (#130) - Hardened Version
# ==============================================================================

set -eo pipefail

# 1. Xác định thư mục
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# 2. Kiểm tra tham số đầu vào
if [ $# -eq 0 ]; then
    echo "================================================================="
    echo "  [LỖI] Thiếu đường dẫn file backup cần phục hồi!"
    echo "  Cách sử dụng: ./restore.sh <duong_dan_file_backup.sql.gz>"
    echo "  Ví dụ: ./restore.sh ../backups/evmanager_backup_20261020_110000.sql.gz"
    echo "================================================================="
    exit 1
fi

RESTORE_FILE="$1"

if [ ! -f "${RESTORE_FILE}" ]; then
    echo "==> [LỖI] File không tồn tại: ${RESTORE_FILE}"
    exit 1
fi

# 3. Đọc biến môi trường từ .env nếu tồn tại
if [ -f "${BACKEND_DIR}/.env" ]; then
    echo "==> Đang nạp cấu hình từ ${BACKEND_DIR}/.env..."
    export $(grep -v '^#' "${BACKEND_DIR}/.env" | xargs)
fi

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-evmanager}"
DB_USERNAME="${DB_USERNAME:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"

echo "================================================================="
echo "  CẢNH BÁO: HÀNH ĐỘNG NÀY SẼ GHI ĐÈ TOÀN BỘ CƠ SỞ DỮ LIỆU HIỆN CÓ!"
echo "  Database đích: ${DB_NAME}@${DB_HOST}:${DB_PORT}"
echo "  File phục hồi: ${RESTORE_FILE}"
echo "================================================================="

# Yêu cầu xác nhận từ người dùng nếu chạy tương tác
if [ -t 0 ]; then
    read -p "Bạn có chắc chắn muốn tiếp tục khôi phục? (yes/no): " CONFIRM
    if [ "${CONFIRM}" != "yes" ]; then
        echo "==> Đã hủy thao tác phục hồi an toàn."
        exit 0
    fi
fi

export PGPASSWORD="${DB_PASSWORD}"
trap 'unset PGPASSWORD' EXIT

# 4. Ngắt các kết nối active trước khi phục hồi CSDL để tránh deadlock với connection pool của backend
echo "==> Đang ngắt các kết nối active tới CSDL ${DB_NAME} để tránh deadlock..."
psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USERNAME}" -d postgres -v ON_ERROR_STOP=1 -c \
"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${DB_NAME}' AND pid <> pg_backend_pid();" 2>/dev/null || true

echo "==> Đang tiến hành khôi phục cơ sở dữ liệu với ON_ERROR_STOP=1..."

if [[ "${RESTORE_FILE}" == *.gz ]]; then
    # Giải nén trên luồng và nạp trực tiếp vào psql
    gunzip -c "${RESTORE_FILE}" | psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USERNAME}" -d "${DB_NAME}" -v ON_ERROR_STOP=1
else
    psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USERNAME}" -d "${DB_NAME}" -v ON_ERROR_STOP=1 -f "${RESTORE_FILE}"
fi

echo "================================================================="
echo "  ==> [THÀNH CÔNG] Dữ liệu đã được phục hồi nguyên vẹn 100%!"
echo "================================================================="
