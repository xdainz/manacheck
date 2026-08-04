import useTranslation from "../hooks/useTranslation";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    const { t } = useTranslation();

    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            <button
                type="button"
                className="input-clear"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
            >
                {t("pagination.previous")}
            </button>
            <span className="pagination-label">
                {t("pagination.pageOf", { current: page, total: totalPages })}
            </span>
            <button
                type="button"
                className="input-clear"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
            >
                {t("pagination.next")}
            </button>
        </div>
    );
}

export default Pagination;
