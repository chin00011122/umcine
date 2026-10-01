interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

const pages = [1, 2, 3, 4, 5];

export default function Pagination({
  currentPage,
  onPageChange,
}: PaginationProps) {
  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button
        className="page-button arrow-button"
        type="button"
        disabled={currentPage === 1}
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
        disabled={currentPage === 5}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="다음 페이지"
      >
        <img src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}
