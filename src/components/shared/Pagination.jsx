
import { Button } from "@/components/ui/button";

const Pagination = ({
    page,
    totalPages = 1,
    onPageChange,
    isLoading,
}) => {
    return (
        <div className="flex justify-between items-center mt-4">
            <Button
                variant="outline"
                disabled={page === 1 || isLoading}
                onClick={() => onPageChange(page - 1)}
            >
                Previous
            </Button>

            <span>
                Page {page} of {totalPages}
            </span>

            <Button
                variant="outline"
                disabled={page >= totalPages || isLoading}
                onClick={() => onPageChange(page + 1)}
            >
                Next
            </Button>
        </div>
    );
};

export default Pagination;
