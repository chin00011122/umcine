interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const visiblePageCount = Math.min(totalPages, 5);
  const firstPage = Math.min(
    Math.max(1, currentPage - Math.floor(visiblePageCount / 2)),
    Math.max(1, totalPages - visiblePageCount + 1),
  );
  const pages = Array.from({ length: visiblePageCount }, (_, index) => firstPage + index);
  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button
        className="page-button arrow-button"
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="이전 페이지"
      >
        <img src="/icons/chevron-left.svg" alt="" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`page-button ${currentPage === page ? "active" : ""}`}
          type="button"
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="page-button arrow-button"
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="다음 페이지"
      >
        <img src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}
