
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Pagination.css'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination-controls">
      <FaChevronLeft
        className={`pagination-arrow ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      />
      <span className="page-info">
        Page {currentPage} of {totalPages}
      </span>
      <FaChevronRight
        className={`pagination-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
      />
    </div>
  );
};

export default Pagination;